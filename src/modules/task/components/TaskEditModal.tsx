'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { taskSchema, TaskInput } from '../schemas/task.schema';
import { taskService, Task } from '../services/task.service';
import { serializeError } from '@/core/utils/error.util';

interface Props {
  task: Task;
  onUpdated: (task: Task) => void;
  onCancel: () => void;
}

export function TaskEditModal({ task, onUpdated, onCancel }: Props) {
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: { name: task.name, description: task.description, priority: task.priority },
  });

  const onSubmit = async (data: TaskInput) => {
    setApiError(null);
    try {
      const updated = await taskService.update(task.id, data);
      onUpdated(updated);
    } catch (err) {
      setApiError(serializeError(err).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">Editar tarea</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
            <input {...register('name')}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all
                ${errors.name ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Descripción</label>
            <textarea {...register('description')} rows={3}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white outline-none transition-all resize-none
                ${errors.description ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100'}`} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input {...register('priority')} type="checkbox" className="peer sr-only" />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-black transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm text-gray-600">Prioridad alta</span>
          </label>

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