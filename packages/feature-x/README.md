# `@repo/feature-x`

**Task manager** feature: create tasks, toggle completion, remove tasks. Uses **Zustand** for local state, **`@repo/ui-components`** for UI, and **`@repo/utils`** for `formatDate` and `capitalize`.

## Public API

```tsx
import { TaskManagerScreen, useTaskStore } from '@repo/feature-x';
```

- `TaskManagerScreen` — ready-to-mount route-level UI.
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
- All UX copy and rules stay inside this package; the shell app only mounts the screen.

## Build

`npm run build` emits **declaration files only** (`dist/*.d.ts`) so downstream `tsc` resolves types without pulling TSX sources into other `rootDir`s.
