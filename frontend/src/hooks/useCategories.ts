import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryBySlug } from '@/lib/api/categories';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  });

export const useCategoryBySlug = (slug: string) =>
  useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });
