import * as React from 'react';
import { cn } from '../lib/cn.js';

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Max width token */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
};

const maxWidthClass: Record<NonNullable<ContainerProps['maxWidth']>, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = 'xl', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidthClass[maxWidth], className)}
      {...props}
    />
  ),
);
Container.displayName = 'Container';

export type GridProps = React.HTMLAttributes<HTMLDivElement> & {
  cols?: 1 | 2 | 3 | 4 | 12;
  gap?: 'sm' | 'md' | 'lg';
};

const gapClass = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
} as const;

const colsClass = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  12: 'grid-cols-12',
} as const;

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 12, gap = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid', colsClass[cols], gapClass[gap], className)}
      {...props}
    />
  ),
);
Grid.displayName = 'Grid';
