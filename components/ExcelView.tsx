import React from 'react';
import { ProjectTask } from '../types';
import { Calendar, User, Clock, CheckCircle2 } from 'lucide-react';

interface ExcelViewProps {
  tasks: ProjectTask[];
  startDate: string;
}

export const ExcelView: React.FC<ExcelViewProps> = ({ tasks, startDate }) => {
  const getRealDate = (startDay: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + startDay);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-green-700 text-white p-2 text-sm font-bold flex items-center gap-2 rounded-t">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
         Plan_de_Proyecto.xlsx
      </div>
      <div className="overflow-auto border border-slate-300 bg-white flex-1 font-mono text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-left">
              <th className="border p-2 w-10 text-center">#</th>
              <th className="border p-2 min-w-[150px]">Fase</th>
              <th className="border p-2 min-w-[250px]">Tarea</th>
              <th className="border p-2 min-w-[100px]">Inicio</th>
              <th className="border p-2 min-w-[100px]">Duración</th>
              <th className="border p-2 min-w-[100px]">Fin</th>
              <th className="border p-2 min-w-[150px]">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => {
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + task.startDay + task.duration);

              return (
                <tr key={task.id} className="hover:bg-blue-50">
                  <td className="border p-2 text-center bg-slate-50 text-slate-500">{index + 1}</td>
                  <td className="border p-2 text-slate-700 font-medium">{task.phase}</td>
                  <td className="border p-2">{task.name}</td>
                  <td className="border p-2 text-right">{getRealDate(task.startDay)}</td>
                  <td className="border p-2 text-right">{task.duration} días</td>
                  <td className="border p-2 text-right">{endDate.toLocaleDateString('es-ES')}</td>
                  <td className="border p-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {task.assignedTo.charAt(0)}
                    </div>
                    {task.assignedTo}
                  </td>
                </tr>
              );
            })}
             {/* Calculation Row simulating Excel Summary */}
             <tr className="bg-slate-50 font-bold">
                <td className="border p-2"></td>
                <td className="border p-2">TOTAL</td>
                <td className="border p-2">{tasks.length} Tareas</td>
                <td className="border p-2"></td>
                <td className="border p-2 text-right">
                    {tasks.reduce((acc, t) => acc + t.duration, 0)} H/D
                </td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
