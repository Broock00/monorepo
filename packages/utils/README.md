# `@repo/utils`

Shared, **UI-free** TypeScript utilities used by features and (optionally) backend code.

## Contents

| Module            | Responsibility                                      |
| ----------------- | --------------------------------------------------- |
| `formatDate`      | Locale-aware `Intl` date formatting                 |
| `capitalize`      | Unicode-safe first-character capitalization         |
| `debounce`        | Debounced callbacks with `cancel()`                 |
| `createApiClient` | Typed JSON `fetch` wrapper with consistent errors   |
| `normalizeError` / `toErrorMessage` | Structured error helpers           |

## Structure

```
src/
  api-client.ts
  capitalize.ts
  debounce.ts
  error-handler.ts
  format-date.ts
  index.ts
```

## Usage

```ts
import { createApiClient, formatDate, debounce } from '@repo/utils';

const client = createApiClient({ baseUrl: 'https://api.example.com' });
const users = await client.get<User[]>('/users');

const save = debounce(() => {
  /* ... */
}, 300);
```

## Build & types

- `npm run build` — typechecks then emits `dist/` (`.js` + `.d.ts`).
- Package `exports` expose **`types` → `dist`** and **`import` → `src`** so apps can bundle source while `tsc` reads declarations.
