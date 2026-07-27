import { useState } from 'react';
import { Star } from 'lucide-react';

import { Button, FormErrorMessage, TextAreaField } from '@core/components';

interface RatingFormProps {
  /** Caller owns the actual Firestore write(s) — this component only collects input. */
  onSubmit: (value: number, comment?: string) => Promise<void>;
}

export function RatingForm({ onSubmit }: RatingFormProps) {
  const [value, setValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (value === 0) {
      setError('Please select a star rating.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(value, comment.trim() || undefined);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your rating.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-card border border-surface-border bg-white/10 backdrop-blur-xl border border-white/20 p-5 text-sm text-white/80">
        Thanks for rating your helper!
      </div>
    );
  }

  return (
    <div className="rounded-card border border-surface-border bg-white/10 backdrop-blur-xl border border-white/20 p-5">
      <h2 className="text-sm font-semibold text-text-primary">Rate your helper</h2>

      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            className="p-0.5"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                (hoverValue || value) >= star
                  ? 'fill-status-pending text-status-pending'
                  : 'text-surface-border'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mt-3">
        <TextAreaField
          label="Comment (optional)"
          rows={2}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <FormErrorMessage message={error} />

      <div className="mt-3">
        <Button fullWidth={false} onClick={handleSubmit} isLoading={isSubmitting}>
          Submit Rating
        </Button>
      </div>
    </div>
  );
}
