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

export function TaskManagerScreen() {
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleCompleted = useTaskStore((s) => s.toggleCompleted);
  const removeTask = useTaskStore((s) => s.removeTask);

  const [draft, setDraft] = React.useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(draft);
    setDraft('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Create, complete, and remove tasks. State is local to this feature.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="task-title" className="text-sm font-medium text-foreground">
                New task
              </label>
              <Input
                id="task-title"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. Ship modular monorepo"
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="shrink-0">
              Add task
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks yet. Add one above.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id}>
                <Card className={task.completed ? 'opacity-80' : undefined}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={
                            task.completed
                              ? 'font-medium line-through text-muted-foreground'
                              : 'font-medium'
                          }
                        >
                          {capitalize(task.title)}
                        </p>
                        <Badge variant={task.completed ? 'success' : 'secondary'}>
                          {task.completed ? 'Done' : 'Open'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(task.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleCompleted(task.id)}
                      >
                        {task.completed ? 'Mark open' : 'Mark done'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeTask(task.id)}
                      >
                        Remove
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
  );
}
