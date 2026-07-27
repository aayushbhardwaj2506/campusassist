import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@core/auth';
import { LoadingSpinner } from '@core/components';
import { buildParcelAssistanceDetailPath } from '@core/router/routePaths';
import { ParcelRequestForm } from '../components/ParcelRequestForm';
import { useParcelRequest } from '../hooks/useParcelRequest';
import { updateParcelRequestMetadata } from '../services/parcelAssistanceService';
import type { ParcelAssistanceMetadata } from '../types';

export function EditParcelRequestPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { request, loading } = useParcelRequest(requestId);

  async function handleSubmit(metadata: ParcelAssistanceMetadata) {
    if (!requestId) return;
    await updateParcelRequestMetadata(requestId, metadata);
    navigate(buildParcelAssistanceDetailPath(requestId));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner label="Loading request…" />
      </div>
    );
  }

  if (!request) {
    return <p className="text-sm text-white/80">This request could not be found.</p>;
  }

  if (request.requesterId !== user?.uid) {
    return <p className="text-sm text-white/80">You can only edit your own requests.</p>;
  }

  if (request.status !== 'open') {
    return (
      <p className="text-sm text-white/80">
        This request can no longer be edited because it&apos;s no longer open.
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-primary">Edit request</h1>
      <ParcelRequestForm
        initialValues={request.metadata}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
