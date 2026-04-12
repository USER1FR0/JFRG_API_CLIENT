'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, ShieldAlert } from 'lucide-react';
import { loginSchema, LoginInput } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { useAuth } from '@/core/hooks/useAuth';
import { useLoginGuard } from '../hooks/useLoginGuard';
import { serializeError } from '@/core/utils/error.util';
import { setTokenAccessor, setTokenRefreshedHandler, setUnauthorizedHandler } from '@/core/http/axios.client';

export function LoginForm() {
  const { setSession, clearSession } = useAuth();
  const router = useRouter();
  const { isLocked, remainingSeconds, registerFailure, registerSuccess } = useLoginGuard();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    if (isLocked) return;
    setApiError(null);

    try {
      const res = await authService.login(data);

      // Configurar interceptores con el token y el handler de logout
      setTokenAccessor(() => res.access_token);
      setUnauthorizedHandler(() => {
        clearSession();
        router.replace('/login');
      });

      setSession(res.access_token);
      // En LoginForm.tsx, después de setSession(res.access_token):
      setTokenAccessor(() => res.access_token);
      setUnauthorizedHandler(() => {
        clearSession();
        router.replace('/login');
      });
      setTokenRefreshedHandler((newToken: string) => {
        setSession(newToken);
      });
      registerSuccess();
      router.replace('/dashboard');
    } catch (err) {
      registerFailure();
      const { message } = serializeError(err);
      setApiError(message);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-10">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-6">
          <Lock size={18} className="text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Bienvenido</h1>
        <p className="text-sm text-gray-400 mt-1">Inicia sesión para continuar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Usuario</label>
          <input
            {...register('username')}
            autoComplete="username"
            placeholder="tu_usuario"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all
              ${errors.username
                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`}
          />
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Contraseña</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm bg-white outline-none transition-all
                ${errors.password
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Error de API */}
        {apiError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
            <ShieldAlert size={14} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-600">{apiError}</p>
          </div>
        )}

        {/* Rate limit warning */}
        {isLocked && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
            <ShieldAlert size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              Demasiados intentos. Espera <strong>{remainingSeconds}s</strong> para continuar.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isLocked}
          className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-xl
            hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isSubmitting ? 'Verificando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="text-xs text-center text-gray-400 mt-6">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-gray-900 font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
