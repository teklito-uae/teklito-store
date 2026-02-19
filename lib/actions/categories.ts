'use server';

import WooCommerce from '../woocommerce';
import { Category } from '../types';
import { mapWooCommerceCategory } from '../woocommerce-utils';

export async function getCategories() {
    try {
        const response = await WooCommerce.get('products/categories', {
            per_page: 100,
            hide_empty: false
        });
        return (response.data || []).map(mapWooCommerceCategory);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getCategoryBySlug(slug: string) {
    try {
        const response = await WooCommerce.get('products/categories', { slug });
        const category = response.data?.[0];
        if (!category) return null;
        return mapWooCommerceCategory(category);
    } catch (error) {
        console.error('Error fetching category by slug:', error);
        return null;
    }
}

export async function getCategoryMetadata(slug: string) {
    try {
        const category = await getCategoryBySlug(slug);
        if (!category) return null;

        // WooCommerce categories are hierarchical natively.
        // For metadata, we can fetch children if needed, but for now we match existing structure.
        return {
            subcategories: [], // Can be populated by fetching children of category.id if needed
            brands: [] // Brands might be a different taxonomy or attribute in WC
        };
    } catch (error) {
        console.error('Error fetching category metadata:', error);
        return null;
    }
}
