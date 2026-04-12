import { api } from '../api';
import type { User, LoginCredentials, RegisterData, ApiResponse } from '../types';

export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
  const data = response.data;
  return { user: data.user, token: data.token };
};

export const register = async (data: RegisterData): Promise<{ user: User; token: string }> => {
  const response = await api.post<{ user: User; token: string }>('/auth/register', data);
  const res = response.data;
  return { user: res.user, token: res.token };
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getAuthUser = async (): Promise<User | null> => {
  const response = await api.get<User>('/auth/me');
  return response.data ?? null;
};
