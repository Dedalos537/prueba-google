import React, { useMemo } from 'react';
import { ProjectTask } from '../types';

interface GanttChartProps {
  tasks: ProjectTask[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const totalDays = useMemo(() => {
    if (tasks.length === 0) return 30;
    const maxDay = Math.max(...tasks.map(t => t.startDay + t.duration));
    return maxDay + 2; // buffer
  }, [tasks]);

  // Group tasks by phase
  const tasksByPhase = useMemo(() => {
    const groups: Record<string, ProjectTask[]> = {};
    tasks.forEach(t => {
      if (!groups[t.phase]) groups[t.phase] = [];
      groups[t.phase].push(t);
    });
    return groups;
  }, [tasks]);

  const phases = Object.keys(tasksByPhase);

  return (
    <div className="w-full h-full overflow-auto bg-white border rounded shadow-sm text-xs">
      {/* Header Timeline */}
      <div className="sticky top-0 z-10 bg-slate-100 border-b flex">
        <div className="w-48 min-w-[12rem] p-2 font-bold border-r bg-slate-200">Tarea / Fase</div>
        <div className="flex-1 flex">
          {Array.from({ length: totalDays }).map((_, i) => (
            <div key={i} className="w-8 min-w-[2rem] flex-shrink-0 border-r text-center text-slate-500 py-1">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="relative">
        {phases.map((phase) => (
          <div key={phase}>
            {/* Phase Header */}
            <div className="bg-slate-50 font-semibold px-2 py-1 border-b text-primary uppercase tracking-wide text-[10px]">
              {phase}
            </div>
            {tasksByPhase[phase].map((task) => (
              <div key={task.id} className="flex border-b hover:bg-slate-50 transition-colors h-10 items-center relative">
                <div className="w-48 min-w-[12rem] p-2 truncate border-r font-medium z-10 bg-white">
                  {task.name}
                </div>
                
                {/* Grid Background for this row */}
                <div className="absolute left-48 right-0 top-0 bottom-0 flex h-full pointer-events-none">
                   {Array.from({ length: totalDays }).map((_, i) => (
                    <div key={`grid-${task.id}-${i}`} className="w-8 min-w-[2rem] flex-shrink-0 border-r h-full opacity-20"></div>
                  ))}
                </div>

                {/* Task Bar */}
                <div className="flex-1 relative h-full flex items-center">
                  <div
                    className="absolute h-6 rounded shadow-sm bg-blue-500 hover:bg-blue-600 transition-all cursor-pointer flex items-center justify-center text-white px-2 overflow-hidden whitespace-nowrap"
                    style={{
                      left: `${task.startDay * 2}rem`, // 2rem = w-8
                      width: `${task.duration * 2}rem`,
                    }}
                    title={`${task.name} (${task.duration} días)`}
                  >
                    <span className="drop-shadow-md">{task.duration}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
