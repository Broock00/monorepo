import '@repo/ui-components/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from './shell/app-shell.js';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

createRoot(rootEl).render(
  <StrictMode>
    <AppShell />
  </StrictMode>,
);
