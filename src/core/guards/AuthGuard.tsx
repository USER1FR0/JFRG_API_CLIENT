'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/hooks/useAuth';
import { ShieldAlert } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, sessionExpiredAlert, dismissExpiredAlert } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !sessionExpiredAlert) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, sessionExpiredAlert, router]);

  const handleDismiss = () => {
    dismissExpiredAlert();
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && children}

      {/* Modal sesión expirada */}
      {sessionExpiredAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={22} className="text-amber-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Sesión expirada</h2>
            <p className="text-sm text-gray-400 mb-6">
              Tu sesión ha finalizado por inactividad. Por favor inicia sesión nuevamente.
            </p>
            <button
              onClick={handleDismiss}
              className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-xl
                hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}