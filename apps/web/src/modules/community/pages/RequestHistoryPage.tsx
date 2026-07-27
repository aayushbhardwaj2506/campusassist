import { FormErrorMessage, LoadingSpinner } from '@core/components';
import { HistoryItemCard } from '../components/HistoryItemCard';
import { useRequestHistory } from '../hooks/useRequestHistory';

export function RequestHistoryPage() {
  const { items, loading, error } = useRequestHistory();

return (
  <div
    className="min-h-screen bg-cover bg-center bg-fixed"
    style={{
      backgroundImage: "url('/images/history-bg.jpg')",
    }}
  >
    <div className="min-h-screen bg-black/20 px-4 py-6">
      <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Request History</h1>
        <p className="mt-1 text-sm text-white/80">
          Everything you&apos;ve requested or helped with, across every service.
        </p>
      </div>

      <FormErrorMessage message={error} />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner label="Loading history…" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-card border border-dashed border-surface-border p-8 text-center text-sm text-orange-300">
          No history yet — your requests and the ones you help with will show up here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <HistoryItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
        </div>
    </div>
  </div>
);
}