'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Loader2, AlertCircle, Flag, Pencil } from 'lucide-react';
import { taskService, Task } from '../services/task.service';
import { TaskForm } from './TaskForm';
import { useAuth } from '@/core/hooks/useAuth';
import { serializeError } from '@/core/utils/error.util';
import { sanitize } from '@/core/utils/sanitize.util';
import { TaskEditModal } from './TaskEditModal';

function groupByDate(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const date = new Date(task.createdAt).toLocaleDateString('es-MX', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});
}

export function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const all = await taskService.getAll();
      const mine = all.filter(t => t.user_id === user?.id);
      setTasks(mine);
    } catch (err) {
      setError(serializeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const toggleComplete = async (task: Task) => {
    try {
      await taskService.update(task.id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    } catch (err) {
      setError(serializeError(err).message);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(serializeError(err).message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreated = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    setShowForm(false);
  };

  const grouped = groupByDate(tasks);
  const pendingCount = tasks.filter(t => !t.completed).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Tareas</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {pendingCount === 0 ? 'Todo al día ✓' : `${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-black text-white text-sm font-medium
            px-4 py-2 rounded-xl hover:bg-gray-800 active:scale-[0.97] transition-all"
        >
          <Plus size={15} />
          Nueva tarea
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {showForm && (
        <TaskForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
      )}

      {tasks.length === 0 && !showForm && (
        <div className="text-center py-20">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">No tienes tareas aún</p>
          <p className="text-xs text-gray-300 mt-1">Crea una para comenzar</p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(grouped).map(([date, dateTasks]) => (
          <div key={date}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 capitalize">
              {date}
            </p>
            <div className="space-y-2">
              {dateTasks.map(task => {
                const done = task.completed;
                return (
                  <div
                    key={task.id}
                    className={`group flex items-start gap-3 p-4 rounded-2xl border transition-all
                      ${done
                        ? 'bg-gray-50 border-gray-100'
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}
                  >
                    <button
                      onClick={() => toggleComplete(task)}
                      className="mt-0.5 shrink-0 transition-colors"
                    >
                      {done
                        ? <CheckCircle2 size={18} className="text-green-500" />
                        : <Circle size={18} className="text-gray-300 hover:text-gray-400" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium transition-all ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {sanitize(task.name)}
                      </p>
                      <p className={`text-xs mt-0.5 ${done ? 'text-gray-300' : 'text-gray-400'}`}>
                        {sanitize(task.description)}
                      </p>
                    </div>

                    {task.priority && !done && (
                      <Flag size={13} className="text-amber-400 shrink-0 mt-1" />
                    )}

                    <button
                      onClick={() => setEditingTask(task)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-600"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity
                        text-gray-300 hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingId === task.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Trash2 size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onUpdated={(updated) => {
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
            setEditingTask(null);
          }}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}