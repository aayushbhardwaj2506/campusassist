import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { LoadingSpinner } from './LoadingSpinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Shows a spinner and disables the button, for async actions (form submits, etc.). */
  isLoading?: boolean;
  /** Defaults to true (buttons fill their container, the common case in forms). Set false for inline/toolbar buttons. */
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary:
    'border border-surface-border bg-surface-overlay text-text-primary hover:bg-surface-border',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-overlay',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      isLoading = false,
      fullWidth = true,
      disabled,
      className = '',
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`flex items-center justify-center gap-2 rounded-card px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? 'w-full' : ''} ${VARIANT_CLASSES[variant]} ${className}`}
        {...rest}
      >
        {isLoading && <LoadingSpinner size="sm" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
