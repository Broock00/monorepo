import { describe, expect, it, beforeEach } from 'vitest';
import { useTaskStore } from './task-store.js';

describe('useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      filter: 'all',
      timer: {
        durationMinutes: 25,
        remainingSeconds: 25 * 60,
        running: false,
        sessionsCompleted: 0,
      },
    });
  });

  it('adds, updates, and changes task status', () => {
    useTaskStore.getState().addTask({ title: 'hello', description: 'world' });
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0]?.status).toBe('todo');
    useTaskStore.getState().updateTask(tasks[0]!.id, { title: 'updated' });
    expect(useTaskStore.getState().tasks[0]?.title).toBe('updated');
    useTaskStore.getState().setTaskStatus(tasks[0]!.id, 'done');
    expect(useTaskStore.getState().tasks[0]?.status).toBe('done');
  });

  it('ticks the study timer', () => {
    useTaskStore.getState().startTimer();
    useTaskStore.getState().tickTimer();
    expect(useTaskStore.getState().timer.remainingSeconds).toBe(25 * 60 - 1);
  });
});
