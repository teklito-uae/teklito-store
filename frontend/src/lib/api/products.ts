import { api } from '../api';
import type { Product, GetProductsOptions, ApiResponse } from '../types';

export const getProducts = async (options?: GetProductsOptions): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products', { params: options });
  return response.data ?? [];
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const response = await api.get<Product>(`/products/${slug}`);
  return response.data ?? null;
};

export const searchProducts = async (q: string): Promise<Product[]> => {
  if (!q || q.length < 2) return [];
  const response = await api.get<Product[]>('/products', { params: { search: q } });
  return response.data ?? [];
};
