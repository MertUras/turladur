'use client';

import type { User } from '@turta/shared-types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getProfile, loginUser, registerUser } from '@/services/identity';

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone: string;
    identityNumber: string;
    address: string;
    otpCode: string;
  }) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Access token stays in memory (security rule — no localStorage JWT).
 * Why not NextAuth: Nest already issues JWT; wiring root NextAuth would
 * pull apps/web back onto legacy Prisma auth.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser({ email, password });
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      phone: string;
      identityNumber: string;
      address: string;
      otpCode: string;
    }) => {
      const result = await registerUser(input);
      setAccessToken(result.accessToken);
      setUser(result.user);
      return result.user;
    },
    [],
  );

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!accessToken) return;
    const profile = await getProfile(accessToken);
    setUser(profile);
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, accessToken, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
