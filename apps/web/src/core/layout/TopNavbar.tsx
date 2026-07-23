import { CreditsBadge } from './CreditsBadge';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { UserProfileMenu } from './UserProfileMenu';

interface TopNavbarProps {
  /** Current page title, shown at the left of the bar (e.g. "Dashboard"). */
  title: string;
}

export function TopNavbar({ title }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-surface-border bg-surface/80 px-4 backdrop-blur md:px-6">
      <h2 className="truncate text-base font-semibold text-text-primary">{title}</h2>

      <div className="flex items-center gap-2">
        <CreditsBadge />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationBell />
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
