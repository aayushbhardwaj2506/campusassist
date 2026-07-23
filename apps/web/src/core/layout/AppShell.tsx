import type { ReactNode } from 'react';

import { MobileTabBar } from './MobileTabBar';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

interface AppShellProps {
  /** Page title shown in the top navbar. */
  title: string;
  children: ReactNode;
}

/**
 * Layout shell wrapping every authenticated screen. Desktop shows a
 * persistent left sidebar; below the `md` breakpoint the sidebar is
 * replaced by a bottom tab bar instead — both driven purely by Tailwind's
 * responsive classes (`hidden md:flex` / `md:hidden`), no JS media-query
 * logic needed. Content area gets bottom padding on mobile so the fixed
 * tab bar never overlaps page content.
 */
export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>

      <MobileTabBar />
    </div>
  );
}
