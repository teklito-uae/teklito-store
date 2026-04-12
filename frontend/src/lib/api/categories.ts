import { api } from '../api';
import type { Category, ApiResponse } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  return response.data ?? [];
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const response = await api.get<Category>(`/categories/${slug}`);
  return response.data ?? null;
};
