import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './app-shell';

describe('AppShell', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <AppShell />
      </MemoryRouter>
    );

    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('highlights active navigation link', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <AppShell />
      </MemoryRouter>
    );

    const tasksLink = screen.getByText('Tasks');
    expect(tasksLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders on notes route', () => {
    render(
      <MemoryRouter initialEntries={['/notes']}>
        <AppShell />
      </MemoryRouter>
    );

    const notesLink = screen.getByText('Notes');
    expect(notesLink).toHaveAttribute('aria-current', 'page');
  });

  it('redirects root path to tasks', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppShell />
      </MemoryRouter>
    );

    // After redirect, Tasks should be active
    const tasksLink = screen.getByText('Tasks');
    expect(tasksLink).toHaveAttribute('aria-current', 'page');
  });
});
