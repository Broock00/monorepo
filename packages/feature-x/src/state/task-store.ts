import { create } from 'zustand';
import type { StudyTimer, Task, TaskFilter } from '../model/task.js';

type TaskInput = {
  title: string;
  description?: string;
  deadline?: string | null;
  status?: Task['status'];
};

export type TaskStore = {
  tasks: Task[];
  filter: TaskFilter;
  timer: StudyTimer;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  setTaskStatus: (id: string, status: Task['status']) => void;
  setFilter: (filter: TaskFilter) => void;
  removeTask: (id: string) => void;
  setTimerDuration: (durationMinutes: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
};

function createTask(input: TaskInput): Task {
  const title = input.title.trim();
  const description = (input.description ?? '').trim();
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    description,
    status: input.status ?? 'todo',
    deadline: input.deadline ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  filter: 'all',
  timer: {
    durationMinutes: 25,
    remainingSeconds: 25 * 60,
    running: false,
    sessionsCompleted: 0,
  },
  addTask: (input) => {
    if (!input.title.trim()) return;
    set((state) => ({ tasks: [createTask(input), ...state.tasks] }));
  },
  updateTask: (id, patch) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...patch,
              title: patch.title?.trim() ?? task.title,
              description:
                patch.description !== undefined ? patch.description.trim() : task.description,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    })),
  setTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task,
      ),
    })),
  setFilter: (filter) => set({ filter }),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  setTimerDuration: (durationMinutes) =>
    set((state) => {
      const safeMinutes = Math.max(1, Math.min(120, Math.round(durationMinutes || 25)));
      return {
        timer: {
          ...state.timer,
          durationMinutes: safeMinutes,
          remainingSeconds: safeMinutes * 60,
          running: false,
        },
      };
    }),
  startTimer: () => set((state) => ({ timer: { ...state.timer, running: true } })),
  pauseTimer: () => set((state) => ({ timer: { ...state.timer, running: false } })),
  resetTimer: () =>
    set((state) => ({
      timer: {
        ...state.timer,
        remainingSeconds: state.timer.durationMinutes * 60,
        running: false,
      },
    })),
  tickTimer: () =>
    set((state) => {
      if (!state.timer.running || state.timer.remainingSeconds <= 0) {
        return state;
      }
      const remainingSeconds = state.timer.remainingSeconds - 1;
      const completed = remainingSeconds === 0;
      return {
        timer: {
          ...state.timer,
          remainingSeconds,
          running: !completed,
          sessionsCompleted: completed ? state.timer.sessionsCompleted + 1 : state.timer.sessionsCompleted,
        },
      };
    }),
}));
