'use server';

import WooCommerce from '../woocommerce';
import { Product } from '../types';
import { mapWooCommerceProduct } from '../woocommerce-utils';

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const response = await WooCommerce.get(`products/${id}`);
        const data = response.data;
        if (!data) return null;
        return mapWooCommerceProduct(data);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return null;
    }
}

interface GetProductsOptions {
    limit?: number;
    sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc';
    category?: number; // Filter by category ID
}

export async function getProducts(options?: GetProductsOptions) {
    try {
        const params: any = {
            per_page: options?.limit || 20,
            status: 'publish',
        };

        if (options?.category) {
            params.category = options.category;
        }

        // Sorting
        if (options?.sort === 'popular') {
            params.orderby = 'popularity';
            params.order = 'desc';
        } else if (options?.sort === 'price_asc') {
            params.orderby = 'price';
            params.order = 'asc';
        } else if (options?.sort === 'price_desc') {
            params.orderby = 'price';
            params.order = 'desc';
        } else {
            params.orderby = 'date';
            params.order = 'desc';
        }

        const response = await WooCommerce.get('products', params);
        return (response.data || []).map(mapWooCommerceProduct);
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export async function getProductBySlug(slug: string) {
    try {
        const response = await WooCommerce.get('products', { slug });
        const product = response.data?.[0];
        if (!product) return null;
        return mapWooCommerceProduct(product);
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return null;
    }
}

export async function getProductsByCategory(categorySlug: string) {
    try {
        // First get the category ID
        const catResponse = await WooCommerce.get('products/categories', { slug: categorySlug });
        const category = catResponse.data?.[0];
        if (!category) return [];

        const response = await WooCommerce.get('products', {
            category: category.id,
            status: 'publish',
            per_page: 50
        });
        return (response.data || []).map(mapWooCommerceProduct);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
}

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const response = await WooCommerce.get('products', {
            search: query,
            status: 'publish',
            per_page: 10
        });
        return (response.data || []).map(mapWooCommerceProduct);
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}
