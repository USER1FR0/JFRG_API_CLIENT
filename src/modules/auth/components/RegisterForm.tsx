'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { registerSchema, RegisterInput } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { serializeError } from '@/core/utils/error.util';

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setApiError(null);
    try {
      await authService.register(data);
      setSuccess(true);
      setTimeout(() => router.replace('/login'), 1500);
    } catch (err) {
      const { message } = serializeError(err);
      setApiError(message);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={24} className="text-green-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">¡Cuenta creada!</h2>
        <p className="text-sm text-gray-400 mt-1">Redirigiendo al inicio de sesión...</p>
      </div>
    );
  }

  const Field = ({
    label, name, type = 'text', placeholder, error, extra
  }: {
    label: string;
    name: keyof RegisterInput;
    type?: string;
    placeholder?: string;
    error?: string;
    extra?: React.ReactNode;
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          autoComplete={name === 'password' ? 'new-password' : name}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all
            ${type === 'password' ? 'pr-10' : ''}
            ${error
              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`}
        />
        {extra}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-6">
          <UserPlus size={18} className="text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Crear cuenta</h1>
        <p className="text-sm text-gray-400 mt-1">Completa los datos para registrarte</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre" name="name" placeholder="Juan" error={errors.name?.message} />
          <Field label="Apellido" name="lastName" placeholder="García" error={errors.lastName?.message} />
        </div>

        <Field label="Usuario" name="username" placeholder="juan_garcia" error={errors.username?.message} />

        <Field
          label="Contraseña"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          extra={
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />

        <p className="text-xs text-gray-400">
          Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo (@$!%*?&)
        </p>

        {apiError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
            <ShieldAlert size={14} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-600">{apiError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-xl
            hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-xs text-center text-gray-400 mt-6">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-gray-900 font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
