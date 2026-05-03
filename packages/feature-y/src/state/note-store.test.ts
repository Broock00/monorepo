import { beforeEach, describe, expect, it } from 'vitest';
import { useNoteStore } from './note-store.js';

describe('useNoteStore', () => {
  beforeEach(() => {
    useNoteStore.setState({ notes: [], selectedId: null });
  });

  it('creates and updates notes', () => {
    useNoteStore.getState().addNote('alpha');
    const id = useNoteStore.getState().notes[0]!.id;
    useNoteStore.getState().updateNote(id, { body: 'hello' });
    expect(useNoteStore.getState().notes[0]?.body).toBe('hello');
  });
});
