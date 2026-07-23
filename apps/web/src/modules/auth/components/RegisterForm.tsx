import { useState, type FormEvent } from 'react';

import { Button, FormErrorMessage, TextField } from '@core/components';
import { getAuthErrorMessage, registerWithEmail } from '@core/firebase';

const MIN_PASSWORD_LENGTH = 6;

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): string | null {
  if (!name.trim()) return 'Please enter your name.';
  if (!email.trim()) return 'Please enter your email.';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
}

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const validationError = validate(name, email, password, confirmPassword);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await registerWithEmail({ name: name.trim(), email: email.trim(), password });
      // Registration signs the user in immediately (Firebase behavior);
      // AuthProvider + PublicOnlyRoute handle the redirect to /dashboard.
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormErrorMessage message={formError} />

      <TextField
        label="Full name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={isSubmitting}
        required
      />

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isSubmitting}
        required
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isSubmitting}
        required
      />

      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        disabled={isSubmitting}
        required
      />

      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  );
}
