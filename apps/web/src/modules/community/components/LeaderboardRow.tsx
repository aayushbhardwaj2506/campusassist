import type { LeaderboardEntry } from '../types';

interface LeaderboardRowProps {
  rank: number;
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function LeaderboardRow({ rank, entry, isCurrentUser }: LeaderboardRowProps) {
  const averageRating = entry.ratingCount > 0 ? entry.ratingSum / entry.ratingCount : null;

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-card border p-3 ${
        isCurrentUser ? 'border-accent bg-accent-muted/20' : 'border-surface-border bg-white/10 backdrop-blur-xl border border-white/20'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-6 shrink-0 text-center text-sm font-semibold text-white/80">
          {MEDALS[rank] ?? rank}
        </span>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {entry.name}
            {isCurrentUser && <span className="ml-1 text-orange-300">(You)</span>}
          </p>
          {averageRating !== null && (
            <p className="text-xs text-orange-300">
              ★ {averageRating.toFixed(1)} ({entry.ratingCount})
            </p>
          )}
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold text-accent">{entry.credits} pts</span>
    </div>
  );
}
