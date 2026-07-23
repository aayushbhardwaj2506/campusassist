import { useRef, useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';

import { useAuth } from '@core/auth';
import { logout } from '@core/firebase';
import { useClickOutside } from '@core/hooks';

function getInitial(nameOrEmail: string | null | undefined): string {
  if (!nameOrEmail) return '?';
  return nameOrEmail.trim().charAt(0).toUpperCase();
}

export function UserProfileMenu() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const displayName = user?.displayName || user?.email || 'Account';

  async function handleLogout() {
    setIsSigningOut(true);
    try {
      await logout();
      // ProtectedRoute reacts to the auth-state change and redirects
      // to /login automatically — no manual navigation needed here.
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-card px-2 py-1.5 text-sm text-text-primary transition-colors hover:bg-surface-overlay"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          {getInitial(displayName)}
        </span>
        <span className="hidden max-w-[140px] truncate md:inline">{displayName}</span>
        <ChevronDown className="h-4 w-4 text-text-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 w-56 rounded-card border border-surface-border bg-surface-raised shadow-elevated">
          <div className="border-b border-surface-border px-4 py-3">
            <p className="truncate text-sm font-medium text-text-primary">{displayName}</p>
            {user?.email && <p className="truncate text-xs text-text-muted">{user.email}</p>}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-status-exception transition-colors hover:bg-surface-overlay disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" />
            {isSigningOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
}
