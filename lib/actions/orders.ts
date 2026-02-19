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

export async function getOrderById(id: string) {
    try {
        const response = await WooCommerce.get(`orders/${id}`);
        const order = response.data;

        if (!order) return null;

        return mapWooCommerceOrder(order);
    } catch (error) {
        console.error(`Error fetching order ${id}:`, error);
        return null;
    }
}

function mapWooCommerceOrder(wpOrder: any) {
    return {
        id: String(wpOrder.id),
        orderNumber: wpOrder.number,
        date: wpOrder.date_created,
        status: mapStatus(wpOrder.status),
        items: wpOrder.line_items.map((item: any) => ({
            productId: String(item.product_id),
            productName: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price || '0'),
            total: parseFloat(item.total || '0')
        })),
        total: parseFloat(wpOrder.total || '0'),
        shipping: parseFloat(wpOrder.shipping_total || '0'),
        subtotal: parseFloat(wpOrder.total || '0') - parseFloat(wpOrder.shipping_total || '0'),
        shippingAddress: {
            fullName: `${wpOrder.shipping.first_name} ${wpOrder.shipping.last_name}`,
            addressLine1: wpOrder.shipping.address_1,
            city: wpOrder.shipping.city,
            zipCode: wpOrder.shipping.postcode,
            country: wpOrder.shipping.country
        }
    };
}

function mapStatus(status: string): string {
    const statusMap: Record<string, string> = {
        'pending': 'pending',
        'processing': 'processing',
        'on-hold': 'processing',
        'completed': 'delivered',
        'cancelled': 'cancelled',
        'refunded': 'cancelled',
        'failed': 'cancelled',
        'shipping': 'shipped', // WC might use different status or custom one
        'shipped': 'shipped'
    };
    return statusMap[status] || 'pending';
}
