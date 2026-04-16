import apiClient from '@/core/http/axios.client';

export interface Log {
  id: number;
  statusCode: number;
  timestamp: string;
  path: string;
  error: string;
  errorCode: string;
  session_id: number | null;
  user?: {
    id: number;
    name: string;
    lastName: string;
    username: string;
  } | null;
}

export const logsService = {
  async getAll(): Promise<Log[]> {
    const res = await apiClient.get<Log[]>('/api/logs');
    return res.data;
  },
};