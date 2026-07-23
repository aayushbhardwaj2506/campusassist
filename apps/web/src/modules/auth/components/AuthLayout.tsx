import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Shared shell for every auth screen — matches the approved UI/UX spec:
 * centered card (~400px), floating on the dark surface background, no
 * heavy chrome. Login and Register pages differ only in their `title`,
 * `children` (the form), and `footer` (the alternate-action link).
 */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-[400px] rounded-card border border-surface-border bg-surface-raised p-8 shadow-elevated">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
        </div>

        {children}

        {footer && <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>}
      </div>
    </main>
  );
}
