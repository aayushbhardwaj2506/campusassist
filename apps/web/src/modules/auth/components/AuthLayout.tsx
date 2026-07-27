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
  <main
    className="min-h-screen bg-cover bg-center bg-fixed"
    style={{
      backgroundImage: "url('/images/login-bg.jpg')",
    }}
  >
<div className="flex min-h-screen items-center justify-center bg-black/30 px-4">
  <div className="w-full max-w-[420px] p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-gray-200">
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {footer && (
          <div className="mt-6 text-center text-sm text-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  </main>
);
}