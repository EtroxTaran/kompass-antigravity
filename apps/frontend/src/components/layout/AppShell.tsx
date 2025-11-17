import React from 'react';
import { Outlet } from 'react-router-dom';

import { Navigation } from './Navigation';

/**
 * AppShell Props
 */
interface AppShellProps {
  /** Children to render in the main content area */
  children?: React.ReactNode;
}

/**
 * AppShell Layout Component
 *
 * Main application layout wrapper that provides:
 * - Navigation sidebar (desktop) / hamburger menu (mobile)
 * - Offline indicator
 * - Main content area with Outlet for routes
 *
 * Uses shadcn/ui components for structure.
 * Responsive design (mobile-first).
 *
 * @example
 * ```tsx
 * <AppShell>
 *   <Outlet />
 * </AppShell>
 * ```
 */
export function AppShell({ children }: AppShellProps): React.ReactElement {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 md:ml-0 pt-16 md:pt-0">
        <div className="container mx-auto p-4 md:p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
