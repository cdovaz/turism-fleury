'use client';

import { useState, useEffect, useTransition } from 'react';
import { 
  Check, 
  Lock, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Bot, 
  FastForward,
  Loader2 
} from 'lucide-react';
import { Task, TaskStatus } from '@/types/trail.types';
import { updateTaskStatus, unlockPhaseAction } from '@/actions/trail.actions';

interface Props {
  initialTasks: Task[];
  content: any; // Dicionário de tradução vindo da page.tsx
  currentPhaseId?: string;
}

// Lembre-se de garantir que updateTaskStatus está importada lá no topo do arquivo!
// import { updateTaskStatus, unlockPhaseAction } from '@/actions/trail.actions';

export default function TrailContainer({ 
  initialTasks, 
  content, 
  currentPhaseId = 'fase-1' // <-- CORREÇÃO 1: Adicionada a extração da variável aqui
}: Props) {
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Sincroniza as tasks se as props mudarem (ex: troca de idioma)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED' || t.status === 'SKIPPED').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const isPhaseComplete = progressPercent === 100;

  const handleUpdateTask = async (taskId: string, newStatus: TaskStatus) => {
    setIsLoading(taskId);
    
    // 1. Atualização Otimista APENAS para a tarefa clicada
    const newTasks = [...tasks];
    const taskIndex = newTasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
      newTasks[taskIndex].status = newStatus;
      setTasks(newTasks);
    }
    
    // 2. Chama o backend (que agora faz o efeito dominó)
    const response = await updateTaskStatus(taskId, newStatus);
    
    // 3. Se der erro (ex: sem internet), reverte para o estado seguro do servidor
    if (!response.success) {
      console.error("Erro ao salvar no banco:", response.error);
      setTasks(initialTasks); 
    }
    
    setIsLoading(null);
  };

  const handleNextPhase = () => {
    // Definimos qual será a próxima fase baseada na atual
    const nextPhaseMap: Record<string, string> = {
      'fase-1': 'fase-2',
      'fase-2': 'fase-3',
      'fase-3': 'fase-4'
    };
    
    const nextPhase = nextPhaseMap[currentPhaseId];
    if (!nextPhase) return;

    startTransition(async () => {
      const response = await unlockPhaseAction(nextPhase);
      if (response.success) {
        console.log(`Fase ${nextPhase} desbloqueada com sucesso!`);
      } else {
        console.error(response.error);
      }
    });
  };

 return (
    <div className="w-full space-y-10 pb-20">
      {/* 1. STATUS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-20 z-40 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h2 className="text-slate-900 font-bold text-lg">{content.progressTitle}</h2>
            <p className="text-slate-500 text-xs">{completedCount} / {tasks.length} {content.phaseLabel}</p>
          </div>
          <div className="text-blue-600 font-bold text-xl">{progressPercent}%</div>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* 2. TIMELINE */}
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[28px] before:h-full before:w-1 before:bg-slate-200">
        {tasks.map((task) => {
          const isCompleted = task.status === 'COMPLETED';
          const isSkipped = task.status === 'SKIPPED';
          const isActive = task.status === 'ACTIVE';
          const isLocked = task.status === 'LOCKED';

          return (
            <div key={task.id} className="relative flex items-center">
              <div className={`absolute left-0 w-14 h-14 rounded-full border-4 flex items-center justify-center z-10 
                ${isCompleted || isSkipped ? 'bg-blue-600 border-blue-100' : isActive ? 'bg-white border-blue-600' : 'bg-slate-50 border-slate-200'}`}>
                {(isCompleted || isSkipped) && <Check className="w-6 h-6 text-white" />}
                {isActive && (isLoading === task.id ? <Loader2 className="animate-spin text-blue-600" /> : <Zap className="text-blue-600" />)}
                {isLocked && <Lock className="w-5 h-5 text-slate-300" />}
              </div>

              <div className="ml-20 w-full">
                <div className={`p-6 rounded-2xl border transition-all ${isActive ? 'bg-white border-blue-200 shadow-xl' : 'opacity-60'}`}>
                  <h3 className={`font-bold ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{task.title}</h3>
                  <p className="text-sm text-slate-500 mb-6">{task.description}</p>

                  {isActive && (
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => handleUpdateTask(task.id, 'COMPLETED')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold">{content.status.completed}</button>
                      <button className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                        <Bot className="w-4 h-4 text-blue-400" /> {content.status.delegate}
                      </button>
                      <button onClick={() => handleUpdateTask(task.id, 'SKIPPED')} className="text-slate-400 text-xs font-bold flex items-center gap-1">
                        <FastForward className="w-3 h-3" /> {content.status.skip}
                      </button>
                    </div>
                  )}
                  {(isCompleted || isSkipped) && (
                    <div className="flex items-center gap-2 text-blue-500 text-sm font-bold">
                      <ShieldCheck className="w-4 h-4" /> {isCompleted ? content.status.success : content.status.ignored}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. NEXT PHASE */}
      <div className={`rounded-3xl border p-8 text-center transition-all ${isPhaseComplete ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-50'}`}>
        <h3 className="text-xl font-bold mb-2">{content.gamificationTitle}</h3>
        <p className="text-sm mb-6 opacity-90">{content.gamificationDesc}</p>
        
        <button 
          onClick={handleNextPhase}
          disabled={!isPhaseComplete || isPending} 
          className={`py-3 px-10 rounded-2xl font-bold flex items-center justify-center mx-auto transition-transform ${
            isPhaseComplete 
              ? 'bg-white text-blue-600 hover:scale-105 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>{content.nextPhaseBtn} <ArrowRight className="inline w-5 h-5 ml-2" /></>
          )}
        </button>
      </div>
    </div>
  );
}