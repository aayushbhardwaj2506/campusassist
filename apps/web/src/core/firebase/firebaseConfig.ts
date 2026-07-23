/**
 * Reads and validates Firebase environment variables at module load time.
 *
 * Fails fast (throws) if a required variable is missing, rather than letting
 * the app boot into a half-configured state that fails mysteriously later
 * inside a Firestore call. This is the single source of truth for Firebase
 * config — no other file should read `import.meta.env` directly.
 */

interface FirebaseEnvConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export type AppEnvironment = 'development' | 'staging' | 'production';

function readRequiredEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `[firebaseConfig] Missing required environment variable: ${key}. ` +
        `Copy .env.example to .env.local and fill in your Firebase project values.`,
    );
  }
  return value;
}

export const firebaseConfig: FirebaseEnvConfig = {
  apiKey: readRequiredEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: readRequiredEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readRequiredEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readRequiredEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readRequiredEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readRequiredEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

export const appEnv: AppEnvironment =
  (import.meta.env.VITE_APP_ENV as AppEnvironment) || 'development';

export const isEmulatorEnv = appEnv === 'development';
