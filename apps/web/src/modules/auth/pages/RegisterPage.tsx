import { Link } from 'react-router-dom';

import { ROUTES } from '@core/router/routePaths';
import { AuthLayout } from '../components/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with CampusAssist"
      footer={
        <>
          Already have an account?{' '}
          <Link to={ROUTES.login} className="font-medium text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
