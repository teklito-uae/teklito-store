'use server';

import WooCommerce from '../woocommerce';
import { CartItemWithProduct } from '@/lib/types';
import { revalidatePath } from 'next/cache';

interface CreateOrderParams {
    shippingInfo: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: string;
    items: CartItemWithProduct[];
    userId?: string;
}

export async function createOrder(params: CreateOrderParams) {
    const { shippingInfo, paymentMethod, items } = params;

    try {
        // Map our shipping info to WooCommerce billing/shipping structure
        const firstName = shippingInfo.fullName.split(' ')[0] || '';
        const lastName = shippingInfo.fullName.split(' ').slice(1).join(' ') || '';

        const orderData = {
            payment_method: paymentMethod === 'card' ? 'stripe' : 'cod', // Map payment methods
            payment_method_title: paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery',
            set_paid: false,
            billing: {
                first_name: firstName,
                last_name: lastName,
                address_1: shippingInfo.address,
                city: shippingInfo.city,
                postcode: shippingInfo.zipCode,
                country: shippingInfo.country,
                email: shippingInfo.email,
                phone: shippingInfo.phone
            },
            shipping: {
                first_name: firstName,
                last_name: lastName,
                address_1: shippingInfo.address,
                city: shippingInfo.city,
                postcode: shippingInfo.zipCode,
                country: shippingInfo.country
            },
            line_items: items.map(item => ({
                product_id: parseInt(item.productId),
                quantity: item.quantity
            }))
        };

        const response = await WooCommerce.post('orders', orderData);
        const order = response.data;

        if (!order || !order.id) {
            throw new Error('Failed to create order in WooCommerce');
        }

        revalidatePath('/profile?tab=orders');

        return {
            success: true,
            orderId: String(order.id),
            orderNumber: order.number || String(order.id)
        };

    } catch (error: any) {
        console.error('Order creation failed:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Something went wrong while creating order'
        };
    }
}
