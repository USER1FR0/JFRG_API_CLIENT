'use client';

import { useState, useCallback, useRef } from 'react';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30_000;

export function useLoginGuard() {
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;
  const remainingSeconds = isLocked ? Math.ceil((lockedUntil! - Date.now()) / 1000) : 0;

  const registerFailure = useCallback(() => {
    setAttempts(prev => {
      const next = prev + 1;
      if (next >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_MS;
        setLockedUntil(until);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setLockedUntil(null);
          setAttempts(0);
        }, LOCKOUT_MS);
      }
      return next;
    });
  }, []);

  const registerSuccess = useCallback(() => {
    setAttempts(0);
    setLockedUntil(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { isLocked, remainingSeconds, attempts, registerFailure, registerSuccess };
}
