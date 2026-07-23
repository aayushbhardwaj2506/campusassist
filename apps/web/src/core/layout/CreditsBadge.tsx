import { Coins } from 'lucide-react';

import { useUserProfile } from '@core/users';

/** Renders nothing until the profile has loaded — avoids a layout flash showing "0". */
export function CreditsBadge() {
  const { profile, loading } = useUserProfile();

  if (loading || !profile) return null;

  return (
    <div className="hidden items-center gap-1.5 rounded-card border border-surface-border bg-surface-overlay px-2.5 py-1.5 text-sm font-medium text-text-primary sm:flex">
      <Coins className="h-4 w-4 text-status-pending" />
      {profile.credits}
    </div>
  );
}
