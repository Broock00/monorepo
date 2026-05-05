import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@repo/ui-components';
import { capitalize, formatDate } from '@repo/utils';
import * as React from 'react';
import { useTaskStore } from '../state/task-store.js';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
] as const;

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
}

function toDateInputValue(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function TaskManagerScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const filter = useTaskStore((state) => state.filter);
  const timer = useTaskStore((state) => state.timer);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);
  const setFilter = useTaskStore((state) => state.setFilter);
  const removeTask = useTaskStore((state) => state.removeTask);
  const setTimerDuration = useTaskStore((state) => state.setTimerDuration);
  const startTimer = useTaskStore((state) => state.startTimer);
  const pauseTimer = useTaskStore((state) => state.pauseTimer);
  const resetTimer = useTaskStore((state) => state.resetTimer);
  const tickTimer = useTaskStore((state) => state.tickTimer);

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [deadline, setDeadline] = React.useState('');
  const [status, setStatus] = React.useState<'todo' | 'in-progress' | 'done'>('todo');
  const [durationMinutes, setDurationMinutes] = React.useState('25');

  React.useEffect(() => {
    if (!timer.running) return undefined;
    const id = window.setInterval(() => tickTimer(), 1000);
    return () => window.clearInterval(id);
  }, [tickTimer, timer.running]);

  const filteredTasks = React.useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter, tasks]);

  const onAddTask = (event: React.FormEvent) => {
    event.preventDefault();
    addTask({
      title,
      description,
      deadline: deadline || null,
      status,
    });
    setTitle('');
    setDescription('');
    setDeadline('');
    setStatus('todo');
  };

  const onSetTimer = () => {
    const parsed = Number(durationMinutes);
    if (Number.isNaN(parsed) || parsed <= 0) return;
    setTimerDuration(parsed);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task & Study Manager</CardTitle>
          <CardDescription>
            Create tasks, edit them inline, filter by status, and run a simple study timer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onAddTask} className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="task-title" className="text-sm font-medium text-foreground">
                Task title
              </label>
              <Input
                id="task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Finish monorepo refactor"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label htmlFor="task-description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional notes for the task"
                className="flex min-h-[104px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="task-deadline" className="text-sm font-medium text-foreground">
                Deadline
              </label>
              <Input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="task-status" className="text-sm font-medium text-foreground">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <Button type="submit">Add task</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filter tasks</CardTitle>
              <CardDescription>Switch between task states without leaving the list.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={filter === option.value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {tasks.length === 0 ? 'No tasks yet. Add one above.' : 'No tasks match the current filter.'}
              </p>
            ) : (
              <ul className="space-y-3">
                {filteredTasks.map((task) => (
                  <li key={task.id}>
                    <Card>
                      <CardContent className="space-y-4 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <Input
                              value={task.title}
                              onChange={(event) => updateTask(task.id, { title: event.target.value })}
                            />
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>Created {formatDate(task.createdAt)}</span>
                              <span>Updated {formatDate(task.updatedAt)}</span>
                            </div>
                          </div>
                          <Badge variant={task.status === 'done' ? 'success' : 'secondary'}>
                            {capitalize(task.status)}
                          </Badge>
                        </div>

                        <textarea
                          value={task.description}
                          onChange={(event) => updateTask(task.id, { description: event.target.value })}
                          placeholder="Add details, subtasks, or study notes"
                          className="flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Deadline
                            </label>
                            <Input
                              type="date"
                              value={toDateInputValue(task.deadline)}
                              onChange={(event) =>
                                updateTask(task.id, { deadline: event.target.value || null })
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              {task.deadline ? formatDate(task.deadline) : 'No deadline set'}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Status
                            </label>
                            <select
                              value={task.status}
                              onChange={(event) =>
                                setTaskStatus(task.id, event.target.value as typeof task.status)
                              }
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <option value="todo">Todo</option>
                              <option value="in-progress">In progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              setTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')
                            }
                          >
                            {task.status === 'done' ? 'Reopen' : 'Mark done'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeTask(task.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Study timer</CardTitle>
            <CardDescription>Use a lightweight focus timer while working through tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="study-duration" className="text-sm font-medium text-foreground">
                Duration in minutes
              </label>
              <Input
                id="study-duration"
                type="number"
                min={1}
                max={120}
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(event.target.value)}
                onBlur={onSetTimer}
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/40 px-4 py-5 text-center">
              <p className="text-4xl font-semibold tracking-tight">{formatDuration(timer.remainingSeconds)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {timer.running ? 'Timer running' : 'Timer paused'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={startTimer} disabled={timer.running}>
                Start
              </Button>
              <Button type="button" variant="secondary" onClick={pauseTimer} disabled={!timer.running}>
                Pause
              </Button>
              <Button type="button" variant="ghost" onClick={resetTimer}>
                Reset
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Completed focus sessions: {timer.sessionsCompleted}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
