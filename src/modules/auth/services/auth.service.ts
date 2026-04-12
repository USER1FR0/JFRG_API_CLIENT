import apiClient from '@/core/http/axios.client';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: number;
  name: string;
  lastName: string;
  hashToken?: string;
  createdAt: string;
}

export const authService = {
  async login(data: LoginInput): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/api/auth/login', data);
    return res.data;
  },

  async register(data: RegisterInput): Promise<void> {
    await apiClient.post('/api/user', data);
  },

  async getMe(): Promise<UserProfile> {
    const res = await apiClient.get<UserProfile>('/api/auth/me');
    return res.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },
};
