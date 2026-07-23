interface FormErrorMessageProps {
  message: string | null;
}

/**
 * Top-of-form error banner for failures that aren't tied to one specific
 * field (e.g., "email or password is incorrect", network errors). Renders
 * nothing when `message` is null, so it's safe to always mount.
 */
export function FormErrorMessage({ message }: FormErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="rounded-card border border-status-exception/40 bg-status-exception/10 px-4 py-3 text-sm text-status-exception"
    >
      {message}
    </div>
  );
}
