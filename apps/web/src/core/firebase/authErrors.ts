/**
 * Translates Firebase Auth errors into short, friendly, actionable messages.
 * Firebase's raw error codes (`auth/invalid-credential`, etc.) should never
 * reach the UI directly — this is the single place that decides the copy.
 */
import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use':
    'An account with this email already exists. Try signing in instead.',
  'auth/invalid-email': "That email address doesn't look right. Double-check and try again.",
  'auth/weak-password': 'Choose a stronger password (at least 6 characters).',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Email or password is incorrect. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error — check your connection and try again.',
  'auth/user-disabled': 'This account has been disabled. Contact your campus admin.',
  'auth/operation-not-allowed':
    'Email/password sign-in is not enabled for this project yet.',
};

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? DEFAULT_MESSAGE;
  }
  if (error instanceof Error && error.message) {
    return DEFAULT_MESSAGE; // never surface raw JS error internals to end users
  }
  return DEFAULT_MESSAGE;
}
