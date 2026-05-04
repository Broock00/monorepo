# `@repo/ui-components`

Headless-friendly **React** primitives styled with **Tailwind CSS** and **Radix** where needed (dialog). This package intentionally avoids domain logic.

## What’s included

- **Button** — `primary`, `secondary`, `ghost`, `destructive` variants (CVA).
- **Card** — compound layout (`CardHeader`, `CardTitle`, `CardContent`, …).
- **Input** — baseline form control styles.
- **Dialog** — Radix dialog with overlay + animations.
- **Badge** — semantic tags.
- **Layout** — `Container`, `Grid`.
- **`cn`** — `clsx` + `tailwind-merge` helper.

## Structure

```
src/
  components/
  lib/cn.ts
  styles.css          # Tailwind layers + CSS variables (design tokens)
tailwind-preset.cjs     # Shared theme extension for consuming apps
```

## Consuming in an app

1. **Tailwind**: extend the preset and scan this package in `content`:

```js
// tailwind.config.cjs
module.exports = {
  presets: [require('@repo/ui-components/tailwind-preset')],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui-components/src/**/*.{ts,tsx}',
  ],
};
```

2. **Global styles** (tokens + base):

```ts
import '@repo/ui-components/styles.css';
```

3. **Import components**:

```tsx
import { Button, Card, CardContent } from '@repo/ui-components';
```

## Build

`npm run build` emits `dist/` declarations and JS alongside typechecking.
