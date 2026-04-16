'use client';

import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { decodeJwt, getTokenExpiresIn, JwtPayload } from '@/core/utils/jwt.util';
import axios from 'axios';
import { clearSessionCookie } from '@/core/utils/session.util';


interface AuthState {
  accessToken: string | null;
  user: JwtPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpiredAlert: boolean;
}

interface AuthContextValue extends AuthState {
  setSession: (accessToken: string) => void;
  clearSession: () => void;
  dismissExpiredAlert: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    sessionExpiredAlert: false,
  });

  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSessionRef = useRef<(token: string) => void>(() => {});

  const clearSession = useCallback((expired = false) => {
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    if (typeof window !== 'undefined') {
      clearSessionCookie();
    }
    setState({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sessionExpiredAlert: expired, 
    });
  }, []);

  const dismissExpiredAlert = useCallback(() => {
    setState(prev => ({ ...prev, sessionExpiredAlert: false }));
  }, []);

  const setSession = useCallback((accessToken: string) => {
    const user = decodeJwt(accessToken);
    if (!user) {
      clearSession();
      return;
    }

    setState({
      accessToken,
      user,
      isAuthenticated: true,
      isLoading: false,
      sessionExpiredAlert: false,
    });

    const expiresIn = getTokenExpiresIn(accessToken);
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    expiryTimerRef.current = setTimeout(async () => {
      try {
        const refreshRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/api/auth/refresh`,
          {},
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } }
        );
        setSessionRef.current(refreshRes.data.access_token);
      } catch {
        clearSession(true);
      }
    }, Math.max(0, expiresIn - 5000));
  }, [clearSession]);

  useEffect(() => {
    setSessionRef.current = setSession;
  }, [setSession]);

  useEffect(() => {
    return () => {
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setSession, clearSession: () => clearSession(false), dismissExpiredAlert }}>
      {children}
    </AuthContext.Provider>
  );
}