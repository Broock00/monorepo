import { describe, expect, it, beforeEach } from 'vitest';
import { useTaskStore } from './task-store.js';

describe('useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
  });

  it('adds and toggles tasks', () => {
    useTaskStore.getState().addTask('hello');
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0]?.completed).toBe(false);
    useTaskStore.getState().toggleCompleted(tasks[0]!.id);
    expect(useTaskStore.getState().tasks[0]?.completed).toBe(true);
  });
});
