import { useAuth } from '@core/auth';
import { FormErrorMessage, LoadingSpinner } from '@core/components';
import { LeaderboardRow } from '../components/LeaderboardRow';
import { useLeaderboard } from '../hooks/useLeaderboard';

export function LeaderboardPage() {
  const { user } = useAuth();
  const { entries, loading, error } = useLeaderboard();

return (
  <div
    className="min-h-screen bg-cover bg-center bg-fixed"
    style={{
      backgroundImage: "url('/images/leaderboard-bg.jpg')",
    }}
  >
    <div className="min-h-screen bg-black/20 px-4 py-6">
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Leaderboard</h1>
          <p className="mt-1 text-sm text-white/80">
            Top helpers on campus, ranked by credits earned across every service.
          </p>
        </div>

        <FormErrorMessage message={error} />

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner label="Loading leaderboard…" />
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-card border border-dashed border-surface-border p-8 text-center text-sm text-orange-300">
            No one has earned credits yet — be the first to help someone out!
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {entries.map((entry, index) => (
              <LeaderboardRow
                key={entry.uid}
                rank={index + 1}
                entry={entry}
                isCurrentUser={entry.uid === user?.uid}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}
