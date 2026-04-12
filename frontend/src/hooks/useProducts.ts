import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductBySlug, searchProducts } from '@/lib/api/products';
import type { GetProductsOptions } from '@/lib/types';

export const useProducts = (options?: GetProductsOptions) =>
  useQuery({
    queryKey: ['products', options],
    queryFn: () => getProducts(options),
    staleTime: 1000 * 60 * 5,
  });

export const useProductBySlug = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

export const useSearchProducts = (q: string) =>
  useQuery({
    queryKey: ['search', q],
    queryFn: () => searchProducts(q),
    enabled: q.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
