import { create } from 'zustand';
import type { Habit, Note } from '../model/note.js';

type NotePatch = Partial<Pick<Note, 'title' | 'body'>>;

export type NoteStore = {
  notes: Note[];
  selectedId: string | null;
  habits: Habit[];
  addNote: (title: string, body?: string) => void;
  updateNote: (id: string, patch: NotePatch) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  addHabit: (name: string) => void;
  updateHabit: (id: string, patch: Partial<Pick<Habit, 'name'>>) => void;
  toggleHabit: (id: string, dateKey: string) => void;
  deleteHabit: (id: string) => void;
};

function createNote(title: string): Note {
  const now = new Date().toISOString();
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    body: '',
    createdAt: now,
    updatedAt: now,
  };
}

function createHabit(name: string): Habit {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    completedDates: [],
  };
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  selectedId: null,
  habits: [],
  addNote: (title, body = '') => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const note = createNote(trimmed);
    set((state) => ({
      notes: [
        {
          ...note,
          body,
        },
        ...state.notes,
      ],
      selectedId: note.id,
    }));
  },
  updateNote: (id, patch) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id
          ? {
              ...n,
              ...patch,
              title: patch.title?.trim() ?? n.title,
              body: patch.body?.trim() ?? n.body,
              updatedAt: new Date().toISOString(),
            }
          : n,
      ),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
  selectNote: (id) => set({ selectedId: id }),
  addHabit: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    set((state) => ({ habits: [createHabit(trimmed), ...state.habits] }));
  },
  updateHabit: (id, patch) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              ...patch,
              name: patch.name?.trim() ?? habit.name,
            }
          : habit,
      ),
    })),
  toggleHabit: (id, dateKey) =>
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id !== id) return habit;
        const completedDates = habit.completedDates.includes(dateKey)
          ? habit.completedDates.filter((entry) => entry !== dateKey)
          : [...habit.completedDates, dateKey];
        return {
          ...habit,
          completedDates,
        };
      }),
    })),
  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id),
    })),
}));
