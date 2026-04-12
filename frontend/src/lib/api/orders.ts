import { api } from '../api';
import type { Order, CreateOrderParams, ApiResponse } from '../types';

export const createOrder = async (params: CreateOrderParams): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> => {
  try {
    const payload = {
      shippingInfo: params.shippingInfo,
      paymentMethod: params.paymentMethod,
      items: params.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
      })),
    };
    const response = await api.post<{ success: boolean, orderId: string; orderNumber: string }>('/orders', payload);
    const order = response.data;
    return { success: true, orderId: order?.orderId, orderNumber: order?.orderNumber };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Something went wrong',
    };
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const response = await api.get<Order>(`/orders/${id}`);
  return response.data ?? null;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/user/orders');
  return response.data ?? [];
};
