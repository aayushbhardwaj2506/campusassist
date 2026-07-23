/**
 * Initializes the Firebase SDK exactly once and exports the singleton
 * service instances (Auth, Firestore, Storage) that the rest of the app
 * consumes.
 *
 * No feature code should call `initializeApp`, `getAuth`, `getFirestore`,
 * or `getStorage` directly — always import from here. This keeps emulator
 * wiring, analytics, and future SDK setup (e.g., App Check) centralized
 * in one place.
 */
import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  type Firestore,
  getFirestore,
} from 'firebase/firestore';
import { connectStorageEmulator, type FirebaseStorage, getStorage } from 'firebase/storage';

import { firebaseConfig, isEmulatorEnv } from './firebaseConfig';

/**
 * Guard against re-initialization during Vite HMR (hot module replacement),
 * which would otherwise throw "Firebase App named '[DEFAULT]' already exists".
 */
const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

/**
 * Connects to local Firebase Emulator Suite when running in development.
 * Wrapped in a module-level flag so HMR doesn't attempt to reconnect
 * emulators on every hot reload (Firebase throws if you do).
 */
declare global {
  // eslint-disable-next-line no-var
  var __campusassist_emulators_connected__: boolean | undefined;
}

function connectToEmulatorsIfNeeded(): void {
  if (!isEmulatorEnv) return;
  if (globalThis.__campusassist_emulators_connected__) return;

  const emulatorHost = '127.0.0.1';

  try {
    connectAuthEmulator(auth, `http://${emulatorHost}:9099`, {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, emulatorHost, 8080);
    connectStorageEmulator(storage, emulatorHost, 9199);
    globalThis.__campusassist_emulators_connected__ = true;
    // eslint-disable-next-line no-console
    console.info('[firebaseClient] Connected to local Firebase Emulator Suite.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      '[firebaseClient] Emulator connection skipped (already connected or emulators not running):',
      error,
    );
  }
}

connectToEmulatorsIfNeeded();

export { app, auth, db, storage };
