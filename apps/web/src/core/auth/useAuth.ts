import { useContext } from 'react';

import { AuthContext, type AuthContextValue } from './AuthContext';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth() must be called within an <AuthProvider>.');
  }
  return context;
}
