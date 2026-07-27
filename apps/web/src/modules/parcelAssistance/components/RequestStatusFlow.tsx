import { Check } from 'lucide-react';

import type { ParcelAssistanceStatus } from '../types';

const STEPS: { key: ParcelAssistanceStatus; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'completed', label: 'Completed' },
];

interface RequestStatusFlowProps {
  status: ParcelAssistanceStatus;
}

export function RequestStatusFlow({ status }: RequestStatusFlowProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  isComplete
                    ? 'border-accent bg-accent text-white'
                    : isCurrent
                      ? 'border-accent text-accent'
                      : 'border-surface-border text-orange-300'
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={`whitespace-nowrap text-xs ${
                  isCurrent || isComplete ? 'text-text-primary' : 'text-orange-300'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${index < currentIndex ? 'bg-accent' : 'bg-surface-border'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
