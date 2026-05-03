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

export function NotesScreen() {
  const notes = useNoteStore((s) => s.notes);
  const selectedId = useNoteStore((s) => s.selectedId);
  const addNote = useNoteStore((s) => s.addNote);
  const updateNote = useNoteStore((s) => s.updateNote);
  const deleteNote = useNoteStore((s) => s.deleteNote);
  const selectNote = useNoteStore((s) => s.selectNote);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const [filter, setFilter] = React.useState('');
  const [debouncedFilter, setDebouncedFilter] = React.useState('');

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
    const q = debouncedFilter.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
    );
  }, [notes, debouncedFilter]);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');

  const onCreate = () => {
    addNote(newTitle || 'Untitled note');
    setNewTitle('');
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>
            Quick capture with search debounced via <span className="font-mono">@repo/utils</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search notes…"
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
                <DialogDescription>Give your note a title. You can edit the body after saving.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <label htmlFor="note-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="note-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Meeting recap"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={onCreate}>
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
                    onChange={(e) => updateNote(selected.id, { title: e.target.value })}
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
                    onChange={(e) => updateNote(selected.id, { body: e.target.value })}
                    placeholder="Write something…"
                  />
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
      </div>
    </div>
  );
}
