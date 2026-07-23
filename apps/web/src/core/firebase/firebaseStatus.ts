/**
 * Phase 1 verification helper only.
 *
 * Confirms the Firebase SDK initialized correctly (app instance exists with
 * the expected project ID). This does NOT make a network call and does NOT
 * imply Auth/Firestore/Storage are reachable — it only proves the client
 * SDK is configured and wired correctly, which is the scope of Phase 1.
 * Live connectivity is exercised starting in Phase 3 (Authentication).
 */
import { app } from './firebaseClient';
import { firebaseConfig } from './firebaseConfig';

export interface FirebaseInitStatus {
  initialized: boolean;
  projectId: string;
  appName: string;
}

export function getFirebaseInitStatus(): FirebaseInitStatus {
  return {
    initialized: Boolean(app),
    projectId: firebaseConfig.projectId,
    appName: app.name,
  };
}
