import { useAuth } from '@core/auth';

/**
 * Dummy/generic placeholder content, worded around the platform's generic
 * "request" concept (matching the approved Firestore design) rather than
 * any specific service. Replaced by real, role-aware, Firestore-backed
 * dashboards starting in roadmap Phase 6 — no Parcel Pickup logic here yet.
 */
const DUMMY_STATS = [
  { label: 'Active Requests', value: 2 },
  { label: 'Completed This Month', value: 12 },
  { label: 'Pending Actions', value: 1 },
] as const;

const DUMMY_ACTIVITY = [
  { id: '1', text: 'Request #A182 marked ready for pickup', timeAgo: '2h ago' },
  { id: '2', text: 'Request #A175 completed', timeAgo: '2d ago' },
  { id: '3', text: 'Request #A170 logged', timeAgo: '4d ago' },
] as const;

export function DashboardHomePage() {
  const { user } = useAuth();
  const firstName = (user?.displayName || user?.email || 'there').split(' ')[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Good to see you, {firstName}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Here&apos;s a quick look at your account. (Placeholder data — live data arrives in a
          later phase.)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DUMMY_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border border-surface-border bg-surface-raised p-4"
          >
            <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
            <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-surface-border bg-surface-raised p-4">
        <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {DUMMY_ACTIVITY.map((activity) => (
            <li key={activity.id} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{activity.text}</span>
              <span className="text-xs text-text-muted">{activity.timeAgo}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
