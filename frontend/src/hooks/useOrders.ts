import { useQuery } from '@tanstack/react-query';
import { getMyOrders, getOrderById } from '@/lib/api/orders';
import { useAuthStore } from '@/lib/store/auth';

export const useMyOrders = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
};

export const useOrderById = (id: string) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
