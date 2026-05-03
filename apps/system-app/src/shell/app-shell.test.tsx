import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './app-shell.js';

describe('AppRoutes', () => {
  it('renders navigation', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByText('System app')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tasks' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Notes' })).toBeInTheDocument();
  });
});
