import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from '@repo/ui-components';
import { debounce, formatDate } from '@repo/utils';
import * as React from 'react';
import { useNoteStore } from '../state/note-store.js';

const textareaClassName =
  'flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function isWithinLastSevenDays(dateKey: string, todayKey: string): boolean {
  const current = parseDateKey(dateKey).getTime();
  const today = parseDateKey(todayKey).getTime();
  const diffDays = Math.floor((today - current) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays < 7;
}

function calculateStreak(completedDates: string[], todayKey: string): number {
  const completed = new Set(completedDates);
  let streak = 0;
  const cursor = new Date(parseDateKey(todayKey));

  while (true) {
    const key = toDateKey(cursor);
    if (!completed.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function NotesScreen() {
  const notes = useNoteStore((state) => state.notes);
  const selectedId = useNoteStore((state) => state.selectedId);
  const habits = useNoteStore((state) => state.habits);
  const addNote = useNoteStore((state) => state.addNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const deleteNote = useNoteStore((state) => state.deleteNote);
  const selectNote = useNoteStore((state) => state.selectNote);
  const addHabit = useNoteStore((state) => state.addHabit);
  const updateHabit = useNoteStore((state) => state.updateHabit);
  const toggleHabit = useNoteStore((state) => state.toggleHabit);
  const deleteHabit = useNoteStore((state) => state.deleteHabit);

  const selected = notes.find((note) => note.id === selectedId) ?? null;

  const [filter, setFilter] = React.useState('');
  const [debouncedFilter, setDebouncedFilter] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newBody, setNewBody] = React.useState('');
  const [habitName, setHabitName] = React.useState('');

  const setDebounced = React.useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedFilter(value);
      }, 200),
    [],
  );

  React.useEffect(() => {
    setDebounced(filter);
    return () => setDebounced.cancel();
  }, [filter, setDebounced]);

  const filteredNotes = React.useMemo(() => {
    const query = debouncedFilter.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) || note.body.toLowerCase().includes(query),
    );
  }, [notes, debouncedFilter]);

  const todayKey = React.useMemo(() => toDateKey(new Date()), []);

  const weeklySummary = React.useMemo(() => {
    const completionsThisWeek = habits.reduce(
      (total, habit) =>
        total + habit.completedDates.filter((dateKey) => isWithinLastSevenDays(dateKey, todayKey)).length,
      0,
    );
    const activeHabits = habits.filter((habit) => habit.completedDates.length > 0).length;
    const totalStreak = habits.reduce(
      (total, habit) => total + calculateStreak(habit.completedDates, todayKey),
      0,
    );

    return {
      completionsThisWeek,
      activeHabits,
      averageStreak: habits.length === 0 ? 0 : Math.round(totalStreak / habits.length),
    };
  }, [habits, todayKey]);

  const onCreateNote = () => {
    addNote(newTitle || 'Untitled note', newBody);
    setNewTitle('');
    setNewBody('');
    setDialogOpen(false);
  };

  const onCreateHabit = (event: React.FormEvent) => {
    event.preventDefault();
    addHabit(habitName);
    setHabitName('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notes & Habit Tracker</CardTitle>
          <CardDescription>
            Search and edit notes while tracking recurring habits and weekly consistency.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <Input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="secondary">
                New note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create note</DialogTitle>
                <DialogDescription>
                  Give the note a title and optional body. You can keep editing after saving.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <label htmlFor="note-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="note-title"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Meeting recap"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="note-body" className="text-sm font-medium">
                  Body
                </label>
                <textarea
                  id="note-body"
                  value={newBody}
                  onChange={(event) => setNewBody(event.target.value)}
                  placeholder="Write anything useful"
                  className={textareaClassName}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={onCreateNote}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="space-y-2">
          {filteredNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {notes.length === 0 ? 'No notes yet.' : 'No matches for your search.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredNotes.map((note) => {
                const active = note.id === selectedId;
                return (
                  <li key={note.id}>
                    <button
                      type="button"
                      onClick={() => selectNote(note.id)}
                      className={
                        active
                          ? 'w-full rounded-lg border border-primary/40 bg-card p-3 text-left shadow-sm'
                          : 'w-full rounded-lg border border-border bg-card p-3 text-left shadow-sm hover:border-primary/25'
                      }
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium leading-snug">{note.title}</p>
                        <Badge variant="outline" className="shrink-0">
                          {formatDate(note.updatedAt)}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Created {formatDate(note.createdAt)}</span>
                        <span>Updated {formatDate(note.updatedAt)}</span>
                      </div>
                      {note.body ? (
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{note.body}</p>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <Card className="min-h-[280px]">
            <CardHeader>
              <CardTitle className="text-base">Editor</CardTitle>
              <CardDescription>Select a note to edit or create a new one.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="edit-title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="edit-title"
                      value={selected.title}
                      onChange={(event) => updateNote(selected.id, { title: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-body" className="text-sm font-medium">
                      Body
                    </label>
                    <textarea
                      id="edit-body"
                      className={textareaClassName}
                      value={selected.body}
                      onChange={(event) => updateNote(selected.id, { body: event.target.value })}
                      placeholder="Write something…"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>Created {formatDate(selected.createdAt)}</span>
                    <span>Updated {formatDate(selected.updatedAt)}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" variant="destructive" onClick={() => deleteNote(selected.id)}>
                      Delete note
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No note selected.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Habit tracker</CardTitle>
              <CardDescription>
                Track repeated actions, see current streaks, and capture weekly momentum.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={onCreateHabit} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={habitName}
                  onChange={(event) => setHabitName(event.target.value)}
                  placeholder="Add a habit"
                  aria-label="Add a habit"
                />
                <Button type="submit">Add habit</Button>
              </form>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">This week</p>
                  <p className="mt-1 text-2xl font-semibold">{weeklySummary.completionsThisWeek}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Active habits</p>
                  <p className="mt-1 text-2xl font-semibold">{weeklySummary.activeHabits}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Average streak</p>
                  <p className="mt-1 text-2xl font-semibold">{weeklySummary.averageStreak}</p>
                </div>
              </div>

              {habits.length === 0 ? (
                <p className="text-sm text-muted-foreground">No habits yet. Add one above.</p>
              ) : (
                <ul className="space-y-3">
                  {habits.map((habit) => {
                    const streak = calculateStreak(habit.completedDates, todayKey);
                    const completedToday = habit.completedDates.includes(todayKey);

                    return (
                      <li key={habit.id} className="rounded-xl border border-border p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <Input
                              value={habit.name}
                              onChange={(event) => updateHabit(habit.id, { name: event.target.value })}
                            />
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>{habit.completedDates.length} completions</span>
                              <span>Current streak {streak}</span>
                            </div>
                          </div>
                          <Badge variant={streak > 0 ? 'success' : 'secondary'}>
                            {completedToday ? 'Done today' : 'Pending today'}
                          </Badge>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant={completedToday ? 'secondary' : 'primary'}
                            size="sm"
                            onClick={() => toggleHabit(habit.id, todayKey)}
                          >
                            {completedToday ? 'Undo today' : 'Mark today'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteHabit(habit.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
