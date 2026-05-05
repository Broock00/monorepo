export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskFilter = 'all' | 'todo' | 'in-progress' | 'done';

export type StudyTimer = {
  durationMinutes: number;
  remainingSeconds: number;
  running: boolean;
  sessionsCompleted: number;
};
