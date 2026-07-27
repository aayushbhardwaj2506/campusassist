import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button, FormErrorMessage, LoadingSpinner } from '@core/components';
import { ROUTES } from '@core/router/routePaths';
import { ParcelRequestCard } from '../components/ParcelRequestCard';
import { useMyParcelRequests } from '../hooks/useMyParcelRequests';
import { useOpenParcelRequests } from '../hooks/useOpenParcelRequests';

type Tab = 'browse' | 'mine';

export function ParcelAssistancePage() {
  const [tab, setTab] = useState<Tab>('browse');
  const navigate = useNavigate();

  const open = useOpenParcelRequests();
  const mine = useMyParcelRequests();
  const active = tab === 'browse' ? open : mine;

return (
  <div
    className="min-h-screen bg-cover bg-center bg-fixed"
    style={{
      backgroundImage: "url('/images/parcel-bg.jpg')",
    }}
  >
    <div className="min-h-screen bg-black/20 px-4 py-6">
      <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-card border border-surface-border bg-white/10 backdrop-blur-xl border border-white/20 p-1">
          <button
            type="button"
            onClick={() => setTab('browse')}
            className={`rounded-card px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === 'browse'
                ? 'bg-accent text-white'
                : 'text-white/80 hover:text-text-primary'
            }`}
          >
            Browse
          </button>
          <button
            type="button"
            onClick={() => setTab('mine')}
            className={`rounded-card px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === 'mine'
                ? 'bg-accent text-white'
                : 'text-white/80 hover:text-text-primary'
            }`}
          >
            My Requests
          </button>
        </div>

        <Button
          fullWidth={false}
          onClick={() => navigate(ROUTES.parcelAssistanceNew)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      <FormErrorMessage message={active.error} />

      {active.loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner label="Loading requests…" />
        </div>
      ) : active.requests.length === 0 ? (
        <div className="rounded-card border border-dashed border-surface-border p-8 text-center text-sm text-orange-300">
          {tab === 'browse'
            ? 'No open requests right now — check back soon.'
            : "You haven't created any requests yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.requests.map((request) => (
            <ParcelRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {tab === 'browse' && open.hasMore && !open.loading && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            fullWidth={false}
            onClick={open.loadMore}
            isLoading={open.loadingMore}
          >
            Load more
          </Button>
        </div>
      )}
      </div>
    </div>
  </div>
);
}