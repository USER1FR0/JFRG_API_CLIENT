import apiClient from '@/core/http/axios.client';
import { TaskInput } from '../schemas/task.schema';

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: boolean;
  user_id: number;
  createdAt: string;
  completed: boolean;
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const res = await apiClient.get<Task[]>('/api/task');
    return res.data;
  },

  async getById(id: number): Promise<Task> {
    const res = await apiClient.get<Task>(`/api/task/${id}`);
    return res.data;
  },

  async create(data: TaskInput): Promise<Task> {
    const res = await apiClient.post<Task>('/api/task', data);
    return res.data;
  },

  async update(id: number, data: Partial<TaskInput>): Promise<Task> {
    const res = await apiClient.put<Task>(`/api/task/update/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/task/${id}`);
  },
};
