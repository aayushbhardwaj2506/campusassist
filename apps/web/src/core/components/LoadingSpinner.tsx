interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  /** Optional text shown below the spinner and used as its aria-label. */
  label?: string;
}

const SIZE_CLASSES: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        role="status"
        aria-label={label ?? 'Loading'}
        className={`animate-spin rounded-full border-surface-border border-t-accent ${SIZE_CLASSES[size]}`}
      />
      {label && <span className="text-sm text-text-muted">{label}</span>}
    </div>
  );
}
