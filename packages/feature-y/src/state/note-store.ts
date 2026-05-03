import { create } from 'zustand';
import type { Note } from '../model/note.js';

export type NoteStore = {
  notes: Note[];
  selectedId: string | null;
  addNote: (title: string) => void;
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'body'>>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
};

function createNote(title: string): Note {
  const now = new Date().toISOString();
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    body: '',
    updatedAt: now,
  };
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  selectedId: null,
  addNote: (title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const note = createNote(trimmed);
    set((state) => ({
      notes: [note, ...state.notes],
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
}));
