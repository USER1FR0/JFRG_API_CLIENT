'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldAlert, CheckCircle2, Eye, EyeOff, User } from 'lucide-react';
import { updateUserSchema, UpdateUserInput } from '../schemas/user.schema';
import { userService } from '../services/user.service';
import { useAuth } from '@/core/hooks/useAuth';
import { serializeError } from '@/core/utils/error.util';
import { sanitize } from '@/core/utils/sanitize.util';

export function ProfileForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (!user?.id) return;
    userService.getById(user.id)
      .then(u => {
        reset({
          name: u.name,
          lastName: u.lastName,
          username: u.username,
          password: '',
        });
      })
      .catch(err => setApiError(serializeError(err).message))
      .finally(() => setLoading(false));
  }, [user?.id, reset]);

  const onSubmit = async (data: UpdateUserInput) => {
    if (!user?.id) return;
    setApiError(null);
    setSuccess(false);
    try {
      await userService.update(user.id, data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setApiError(serializeError(err).message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <User size={20} className="text-gray-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Mi perfil</h1>
        <p className="text-sm text-gray-400 mt-0.5">Actualiza tu información personal</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
            <input
              {...register('name')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all
                ${errors.name
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Apellido</label>
            <input
              {...register('lastName')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all
                ${errors.lastName
                  ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`}
            />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Usuario</label>
          <input
            {...register('username')}
            autoComplete="username"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all
              ${errors.username
                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`}
          />
          {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Nueva contraseña <span className="text-gray-300 font-normal">(opcional)</span>
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Dejar vacío para no cambiar"
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
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Feedback */}
        {apiError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
            <ShieldAlert size={14} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-600">{sanitize(apiError)}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3.5 py-3">
            <CheckCircle2 size={14} className="text-green-500 shrink-0" />
            <p className="text-xs text-green-700">Perfil actualizado correctamente</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-xl
            hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
