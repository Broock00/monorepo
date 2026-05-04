# `@repo/feature-y`

**Notes** feature: create notes, edit title/body, delete, and **debounced search** via `@repo/utils`. Uses **Zustand** for state and **`@repo/ui-components`** for layout, dialog, and controls.

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
- Debounced filtering demonstrates shared utilities without coupling to feature-x.

## Build

`npm run build` emits **declaration-only** output to `dist/` for typed consumers.
