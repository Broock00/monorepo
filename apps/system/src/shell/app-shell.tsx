import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { NotesScreen } from '@repo/feature-y';
import { TaskManagerScreen } from '@repo/feature-x';
import { Container } from '@repo/ui-components';

export function AppShell() {
  const location = useLocation();
  const path = location.pathname || '/tasks';
  const isActive = (p: string) => path === p;

  return (
    <Container maxWidth="2xl" className="py-8">
      <header className="mb-6">
        <div className="flex items-baseline gap-6">
          <Link to="/tasks" aria-current={isActive('/tasks') ? 'page' : undefined} className={isActive('/tasks') ? 'text-2xl font-semibold text-slate-900' : 'text-2xl text-slate-500 hover:text-slate-700'}>
            Tasks
          </Link>
          <Link to="/notes" aria-current={isActive('/notes') ? 'page' : undefined} className={isActive('/notes') ? 'text-2xl font-semibold text-slate-900' : 'text-2xl text-slate-500 hover:text-slate-700'}>
            Notes
          </Link>
        </div>
      </header>
      <Routes>
        <Route path="/tasks" element={<TaskManagerScreen />} />
        <Route path="/notes" element={<NotesScreen />} />
        <Route path="/" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </Container>
  );
}
