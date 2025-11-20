export enum TaskStatus {
  TODO = 'Por hacer',
  IN_PROGRESS = 'En progreso',
  DONE = 'Completado',
}

export interface ProjectTask {
  id: string;
  name: string;
  startDay: number; // Relative start day (0 is project start)
  duration: number; // Days
  assignedTo: string;
  status: TaskStatus;
  phase: string;
}

export interface ProjectPlan {
  title: string;
  description: string;
  justification: string;
  objectives: string[];
  startDate: string; // ISO string
  tasks: ProjectTask[];
  team: { name: string; role: string }[];
}

export interface SlideConfig {
  id: string;
  type: 'title' | 'agenda' | 'justification' | 'gantt' | 'excel' | 'team' | 'conclusion';
  title: string;
}
