import { useNavigate } from 'react-router-dom';

import { useAuth } from '@core/auth';
import { buildParcelAssistanceDetailPath } from '@core/router/routePaths';
import { ParcelRequestForm } from '../components/ParcelRequestForm';
import { createParcelRequest } from '../services/parcelAssistanceService';
import type { ParcelAssistanceMetadata } from '../types';

export function NewParcelRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(metadata: ParcelAssistanceMetadata) {
    if (!user) return;
    const requestId = await createParcelRequest({
      requesterId: user.uid,
      requesterNameSnapshot: user.displayName || user.email || 'Student',
      metadata,
    });
    navigate(buildParcelAssistanceDetailPath(requestId));
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">New parcel assistance request</h1>
        <p className="mt-1 text-sm text-white/80">
          Ask another student to pick up or hold your parcel while you&apos;re away.
        </p>
      </div>

      <ParcelRequestForm submitLabel="Post Request" onSubmit={handleSubmit} />
    </div>
  );
}
