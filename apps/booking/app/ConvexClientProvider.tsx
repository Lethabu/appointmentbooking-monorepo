'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AuthResult {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthResult | null>(null);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Mock auth implementation - replace with actual Clerk integration
  const authResult: AuthResult = {
    user: null,
    loading: false,
  };

  return (
    <AuthContext.Provider value={authResult}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}