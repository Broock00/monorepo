# `@repo/feature-x`

**Task and study manager** feature: create, edit, delete, filter, and reschedule tasks while running a simple study timer. Uses **Zustand** for local state, **`@repo/ui-components`** for UI, and **`@repo/utils`** for `formatDate` and `capitalize`.

## Public API

```tsx
import { TaskManagerScreen, useTaskStore } from '@repo/feature-x';
```

- `TaskManagerScreen` — ready-to-mount route-level UI with CRUD, filtering, and timer controls.
- `useTaskStore` / `Task` types — exported for tests or advanced composition.

## Structure

```
src/
  components/task-manager-screen.tsx
  model/task.ts
  state/task-store.ts
  index.ts
```

## Boundaries

- Must **not** import `@repo/feature-y` (features stay isolated).
- Task status, deadlines, filtering, and timer rules stay inside this package; the shell app only mounts the screen.

## Build

`npm run build` emits **declaration files only** (`dist/*.d.ts`) so downstream `tsc` resolves types without pulling TSX sources into other `rootDir`s.
