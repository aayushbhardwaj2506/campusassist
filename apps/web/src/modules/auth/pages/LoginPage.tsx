import { Link } from 'react-router-dom';

import { ROUTES } from '@core/router/routePaths';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your CampusAssist account"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.register} className="font-medium text-accent hover:text-accent-hover">
            Create one
          </Link>
        </>
      }
    >
<>
  <LoginForm />

  <div className="mt-6 rounded-card border border-surface-border bg-white/10 backdrop-blur-xl border border-white/20 p-4 text-sm">
    <h3 className="text-3xl font-bold text-orange-600">
      DEMO LOGIN ID
    </h3>

    

    <div className="mt-4 space-y-3">
      <div>
        <p className="font-medium text-text-primary">Demo Account 1</p>
        <p className="text-white/80">
          Email: campusassist.demo1@gmail.com
        </p>
        <p className="text-white/80">
          Password: CampusAssist@2026!
        </p>

    
      </div>

      <div>
        <p className="font-medium text-text-primary">Demo Account 2</p>
        <p className="text-white/80">
          Email: campusassist.demo2@gmail.com
        </p>
        <p className="text-white/80">
          Password: CampusAssist@2026!
        </p>
    <p className="mt-2 text-white/80">
        ------------------------------------------------------
      We recommend creating your own account for the best experience.
      If you only wish to explore the application, you may use one of the
      shared demo accounts below. 
      Since these are public accounts
      so the displayed data may change during testing.
    </p>
      </div>
    </div>
  </div>
</>    </AuthLayout>
  );
}
