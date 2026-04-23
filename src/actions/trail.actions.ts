"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { TaskStatus } from '@/types/trail.types';

export async function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return { success: false, error: "Não autenticado." };

    const { data: currentTask } = await supabase
      .from('tasks_dictionary')
      .select('phase_id, order_index')
      .eq('id', taskId)
      .single();

    const { error: updateError } = await supabase
      .from('user_task_states')
      .update({ status: newStatus, last_interaction_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('task_id', taskId);

    if (updateError) throw updateError;

    if (currentTask && (newStatus === 'COMPLETED' || newStatus === 'SKIPPED')) {
      const { data: nextTask } = await supabase
        .from('tasks_dictionary')
        .select('id')
        .eq('phase_id', currentTask.phase_id)
        .gt('order_index', currentTask.order_index)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

      if (nextTask) {
        await supabase
          .from('user_task_states')
          .update({ status: 'ACTIVE' })
          .eq('user_id', user.id)
          .eq('task_id', nextTask.id)
          .eq('status', 'LOCKED');
      }
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.error("Erro inesperado em updateTaskStatus:", error);
    return { success: false, error: "Erro interno no servidor." };
  }
}

export async function unlockPhaseAction(nextPhaseId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Usuário não autenticado." };

    const { data: nextTasks, error: fetchError } = await supabase
      .from('tasks_dictionary')
      .select('id, is_blocking')
      .eq('phase_id', nextPhaseId)
      .order('order_index');

    if (fetchError || !nextTasks || nextTasks.length === 0) {
      console.error("Erro ao buscar tarefas da fase:", fetchError);
      return { success: false, error: "Fase não encontrada." };
    }

    const newStates = nextTasks.map((task, index) => ({
      user_id: user.id,
      task_id: task.id,
      status: index === 0 ? 'ACTIVE' : 'LOCKED'
    }));

    const { error: insertError } = await supabase
      .from('user_task_states')
      .upsert(newStates, { onConflict: 'user_id, task_id' });

    if (insertError) {
      console.error("Erro ao destravar fase:", insertError);
      return { success: false, error: "Falha ao salvar progresso." };
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.error("Erro inesperado em unlockPhaseAction:", error);
    return { success: false, error: "Erro interno." };
  }
}