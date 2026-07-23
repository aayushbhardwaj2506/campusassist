export { app, auth, db, storage } from './firebaseClient';
export { firebaseConfig, appEnv, isEmulatorEnv } from './firebaseConfig';
export type { AppEnvironment } from './firebaseConfig';
export { getFirebaseInitStatus } from './firebaseStatus';
export type { FirebaseInitStatus } from './firebaseStatus';
export {
  loginWithEmail,
  registerWithEmail,
  logout,
  subscribeToAuthChanges,
} from './authService';
export type { LoginInput, RegisterInput } from './authService';
export { getAuthErrorMessage } from './authErrors';
