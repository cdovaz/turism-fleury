import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Language, dict } from '@/lib/dictionaries';
import TrailContainer from '@/components/dashboard/TrailContainer';
import { Task, TaskStatus } from '@/types/trail.types';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  // 1. Buscamos o perfil e os estados das tarefas do usuário
  const [profileRes, statesRes] = await Promise.all([
    supabase.from('profiles').select('preferred_language, name').eq('id', user.id).single(),
    supabase.from('user_task_states').select('task_id, status').eq('user_id', user.id)
  ]);

  const userStates = statesRes.data || [];
  const lang = (profileRes.data?.preferred_language as Language) || 'en';
  const d = dict[lang].dashboard as any;

  // 2. Buscamos os detalhes das tarefas que o usuário possui no dicionário do banco
  // Fazemos um JOIN com a tabela de fases para saber a ordem e o título
  const taskIds = userStates.map(s => s.task_id);
  const { data: tasksDetails } = await supabase
    .from('tasks_dictionary')
    .select('*, phases(id, title_key, order_index)')
    .in('id', taskIds);

  if (!tasksDetails || tasksDetails.length === 0) {
    return <div>Nenhuma tarefa encontrada. Verifique o cadastro.</div>;
  }

  // 3. LÓGICA DE DETECÇÃO DE FASE ATUAL:
  // Encontramos a fase que tem pelo menos uma tarefa 'ACTIVE'. 
  // Se todas forem 'COMPLETED', pegamos a de maior 'order_index'.
  const activeTaskIds = userStates.filter(s => s.status === 'ACTIVE').map(s => s.task_id);
  const activeTasks = tasksDetails.filter(t => activeTaskIds.includes(t.id));
  
  // Determinamos a fase atual (ID e Título)
  let currentPhaseId = activeTasks[0]?.phase_id || tasksDetails[tasksDetails.length - 1].phase_id;
  let currentPhaseTitleKey = tasksDetails.find(t => t.phase_id === currentPhaseId)?.phases?.title_key || 'phase1Title';

  // 4. Filtramos as tarefas que pertencem APENAS à fase atual para mostrar no Trail
  const initialTasks: Task[] = tasksDetails
    .filter(t => t.phase_id === currentPhaseId)
    .sort((a, b) => a.order_index - b.order_index)
    .map((dbTask) => {
      const state = userStates.find(s => s.task_id === dbTask.id);
      const translation = d.taskDetails?.[dbTask.id] || { title: dbTask.id, desc: '' };

      return {
        id: dbTask.id,
        title: translation.title,
        description: translation.desc,
        category: dbTask.category,
        status: (state?.status as TaskStatus) || 'LOCKED',
      };
    });

  // 5. Cálculo de progresso da fase atual
  const completedInPhase = initialTasks.filter(t => t.status === 'COMPLETED' || t.status === 'SKIPPED').length;
  const progressPercent = Math.round((completedInPhase / initialTasks.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in duration-700">
      <section className="pt-4">
        <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">
          {d.phases[currentPhaseTitleKey]}
        </span>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mt-1">
          {d.welcomeMsg}, <span className="text-blue-600">{profileRes.data?.name || 'Explorer'}</span> 👋
        </h1>
        <p className="text-slate-500 mt-3 text-lg leading-relaxed">
          {d.progressDesc.replace('{percent}', progressPercent.toString())}
        </p>
      </section>

      {/* Importante: Passamos o currentPhaseId para o container saber quem destravar depois */}
      <TrailContainer 
        initialTasks={initialTasks} 
        content={d} 
        currentPhaseId={currentPhaseId} 
      />
    </div>
  );
}