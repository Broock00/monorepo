# `system`

Vite + React integration shell for the monorepo. **No business rules** live here: it wires **React Router**, imports feature screens, and applies shared layout from `@repo/ui-components`.

## Routes

| Path     | Screen              |
| -------- | ------------------- |
| `/tasks` | `@repo/feature-x`  |
| `/notes` | `@repo/feature-y`  |
| `/`      | Redirect → `/tasks` |

## Scripts

- `npm run dev` — Vite dev server (`5173`).
- `npm run build` — `tsc` (app sources) then production bundle to `dist/`.
- `npm run test` — Vitest + Testing Library (`AppRoutes` smoke test with `MemoryRouter`).

## Tailwind

Uses `tailwind.config.cjs` with the `@repo/ui-components/tailwind-preset` and scans workspace package sources for class names.

## Why no path aliases?

Workspace `package.json` `exports` are the source of truth. Avoid mapping `@repo/ui-components` to a single file in Vite, or subpath imports like `@repo/ui-components/styles.css` will resolve incorrectly.
