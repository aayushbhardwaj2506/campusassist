import type { ReactNode } from 'react';

import { MobileTabBar } from './MobileTabBar';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

interface AppShellProps {
  title: string;
  children: ReactNode;
}

export function AppShell({ title, children }: AppShellProps) {
  return (
<div className="flex min-h-screen">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar title={title} />

        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}