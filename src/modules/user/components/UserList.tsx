'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, Loader2, AlertCircle, Pencil, Users } from 'lucide-react';
import { userService, User } from '../services/user.service';
import { useAuth } from '@/core/hooks/useAuth';
import { serializeError } from '@/core/utils/error.util';
import { sanitize } from '@/core/utils/sanitize.util';
import { UserEditModal } from './UserEditModal';

export function UserList() {
  const { user: sessionUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      const all = await userService.getAll();
      setUsers(all);
    } catch (err) {
      setError(serializeError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await userService.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(serializeError(err).message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdated = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Users size={18} className="text-gray-400" />
          <h1 className="text-xl font-semibold text-gray-900">Usuarios</h1>
        </div>
        <p className="text-sm text-gray-400">{users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        {users.map(u => {
          const isOwn = u.id === sessionUser?.id;
          return (
            <div key={u.id}
              className="group flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-gray-500">
                  {sanitize(u.name).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {sanitize(u.name)} {sanitize(u.lastName)}
                  {isOwn && <span className="ml-2 text-xs text-gray-400 font-normal">(tú)</span>}
                </p>
                <p className="text-xs text-gray-400">@{sanitize(u.username)}</p>
              </div>

              {!isOwn && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={deletingId === u.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                  >
                    {deletingId === u.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onUpdated={handleUpdated}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}