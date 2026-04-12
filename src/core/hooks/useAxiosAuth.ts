'use client';

import { useEffect } from 'react';
import { useAuth } from '@/core/hooks/useAuth';
import { setTokenAccessor, setUnauthorizedHandler, setTokenRefreshedHandler } from '@/core/http/axios.client';
import { useRouter } from 'next/navigation';

export function useAxiosAuth() {
  const { accessToken, clearSession, setSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setTokenAccessor(() => accessToken);

    setUnauthorizedHandler(() => {
      clearSession();
      router.replace('/login');
    });

    setTokenRefreshedHandler((newToken: string) => {
      setSession(newToken);
    });
  }, [accessToken, clearSession, setSession, router]);
}