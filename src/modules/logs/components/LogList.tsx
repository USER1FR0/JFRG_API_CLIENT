'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2, AlertCircle, ShieldAlert, Activity } from 'lucide-react';
import { logsService, Log } from '../services/logs.service';
import { serializeError } from '@/core/utils/error.util';
import { sanitize } from '@/core/utils/sanitize.util';

const STATUS_COLOR: Record<number, string> = {
  400: 'bg-amber-50 text-amber-700 border-amber-100',
  401: 'bg-red-50 text-red-700 border-red-100',
  403: 'bg-red-50 text-red-700 border-red-100',
  404: 'bg-gray-50 text-gray-600 border-gray-100',
  500: 'bg-red-50 text-red-700 border-red-100',
};

function statusColor(code: number) {
  return STATUS_COLOR[code] ?? 'bg-gray-50 text-gray-600 border-gray-100';
}

export function LogList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setError(null);
      const data = await logsService.getAll();
      setLogs(data);
    } catch (err) {
      setError(serializeError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={18} className="text-gray-400" />
          <h1 className="text-xl font-semibold text-gray-900">Logs</h1>
        </div>
        <p className="text-sm text-gray-400">{logs.length} evento{logs.length !== 1 ? 's' : ''} registrado{logs.length !== 1 ? 's' : ''}</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
          <AlertCircle size={14} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {logs.length === 0 && (
        <div className="text-center py-20">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldAlert size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">Sin eventos registrados</p>
        </div>
      )}

      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id}
            className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all">
            <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-lg border ${statusColor(log.statusCode)}`}>
              {log.statusCode}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {sanitize(log.path)}
                </p>
                <span className="text-xs text-gray-300 shrink-0">
                  {new Date(log.timestamp).toLocaleString('es-MX')}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate">{sanitize(log.error)}</p>
              {log.user && (
                <p className="text-xs text-gray-300 mt-0.5">
                  @{sanitize(log.user.username)}
                </p>
              )}
            </div>
            <span className="shrink-0 text-xs text-gray-300 font-mono">{sanitize(log.errorCode)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}