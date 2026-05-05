# `@repo/feature-y`

**Notes and habit tracker** feature: create, edit, delete, and **debounced search** notes while tracking habits, streaks, and a weekly summary. Uses **Zustand** for state and **`@repo/ui-components`** for layout, dialog, and controls.

## Public API

```tsx
import { NotesScreen, useNoteStore } from '@repo/feature-y';
```

## Structure

```
src/
  components/notes-screen.tsx
  model/note.ts
  state/note-store.ts
  index.ts
```

## Boundaries

- Must **not** import `@repo/feature-x`.
- Debounced filtering, habit tracking, streaks, and weekly summary logic stay inside this package.

## Build

`npm run build` emits **declaration-only** output to `dist/` for typed consumers.
