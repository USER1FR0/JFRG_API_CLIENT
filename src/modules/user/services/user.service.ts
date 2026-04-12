import apiClient from '@/core/http/axios.client';
import { UpdateUserInput } from '../schemas/user.schema';

export interface User {
  id: number;
  name: string;
  lastName: string;
  username: string;
  createdAt: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await apiClient.get<User[]>('/api/user');
    return res.data;
  },

  async getById(id: number): Promise<User> {
    const res = await apiClient.get<User>(`/api/user/${id}`);
    return res.data;
  },

  async update(id: number, data: UpdateUserInput): Promise<User> {
    // Nunca enviamos password vacío
    const payload = { ...data };
    if (!payload.password) delete payload.password;
    const res = await apiClient.put<User>(`/api/user/${id}`, payload);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/user/${id}`);
  },
};
