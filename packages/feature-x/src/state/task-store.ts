import { create } from 'zustand';
import type { Task } from '../model/task.js';

export type TaskStore = {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleCompleted: (id: string) => void;
  removeTask: (id: string) => void;
};

function createTask(title: string): Task {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    createdAt: new Date().toISOString(),
    completed: false,
  };
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    set((state) => ({ tasks: [createTask(trimmed), ...state.tasks] }));
  },
  toggleCompleted: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
}));
