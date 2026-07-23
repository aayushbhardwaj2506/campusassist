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
      <LoginForm />
    </AuthLayout>
  );
}
