'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { containsDangerousChars } from '@/core/utils/sanitize.util';
import { userService, User } from '../services/user.service';
import { serializeError } from '@/core/utils/error.util';

const safe = (val: string) => !containsDangerousChars(val);
const notBlank = (val: string) => val.trim().length > 0;

const editSchema = z.object({
  name: z.string().min(3).max(100).refine(notBlank, 'No puede ser solo espacios').refine(safe, 'Caracteres no permitidos'),
  lastName: z.string().min(3).max(100).refine(notBlank, 'No puede ser solo espacios').refine(safe, 'Caracteres no permitidos'),
  username: z.string().min(3).max(100).refine(notBlank, 'No puede ser solo espacios').refine(safe, 'Caracteres no permitidos'),
});

type EditInput = z.infer<typeof editSchema>;

interface Props {
  user: User;
  onUpdated: (user: User) => void;
  onCancel: () => void;
}

export function UserEditModal({ user, onUpdated, onCancel }: Props) {
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditInput>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: user.name, lastName: user.lastName, username: user.username },
  });

  const onSubmit = async (data: EditInput) => {
    setApiError(null);
    try {
      const updated = await userService.update(user.id, data);
      onUpdated(updated);
    } catch (err) {
      setApiError(serializeError(err).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">Editar usuario</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(['name', 'lastName'] as const).map(field => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {field === 'name' ? 'Nombre' : 'Apellido'}
                </label>
                <input {...register(field)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all
                    ${errors[field] ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`} />
                {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]?.message}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Usuario</label>
            <input {...register('username')}
            disabled
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all
                bg-gray-50 text-gray-400 cursor-not-allowed
                ${errors.username ? 'border-red-300' : 'border-gray-200'}`} />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          {apiError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
              <ShieldAlert size={14} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">{apiError}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onCancel}
              className="flex-1 text-sm text-gray-600 font-medium py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-black text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}