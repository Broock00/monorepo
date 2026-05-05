import { beforeEach, describe, expect, it } from 'vitest';
import { useNoteStore } from './note-store.js';

describe('useNoteStore', () => {
  beforeEach(() => {
    useNoteStore.setState({ notes: [], selectedId: null, habits: [] });
  });

  it('creates and updates notes', () => {
    useNoteStore.getState().addNote('alpha', 'body');
    const id = useNoteStore.getState().notes[0]!.id;
    useNoteStore.getState().updateNote(id, { body: 'hello' });
    expect(useNoteStore.getState().notes[0]?.body).toBe('hello');
  });

  it('tracks habits', () => {
    useNoteStore.getState().addHabit('Read');
    const habitId = useNoteStore.getState().habits[0]!.id;
    useNoteStore.getState().toggleHabit(habitId, '2026-05-05');
    expect(useNoteStore.getState().habits[0]?.completedDates).toContain('2026-05-05');
  });
});
