import { Container } from '@repo/ui-components';
import { TaskManagerScreen } from '@repo/feature-x';
import { NotesScreen } from '@repo/feature-y';
import type { ReactNode } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground'
    : 'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground';

function AppChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Modular monorepo
            </p>
            <h1 className="text-xl font-semibold text-foreground">System app</h1>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Primary">
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
            <NavLink to="/notes" className={linkClass}>
              Notes
            </NavLink>
          </nav>
        </Container>
      </header>
      <main className="py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}

/**
 * Routable tree without a concrete `Router` implementation — compose with `BrowserRouter` or `MemoryRouter`.
 */
export function AppRoutes() {
  return (
    <AppChrome>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskManagerScreen />} />
        <Route path="/notes" element={<NotesScreen />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </AppChrome>
  );
}

/**
 * Integration shell only: routing and layout. No feature business logic lives here.
 */
export function AppShell() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
