import { supabase } from '../supabase/client';
import { Product } from '../types';

interface GetProductsOptions {
    limit?: number;
    sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc';
}

export async function getProducts(options?: GetProductsOptions) {
    let query = supabase
        .from('products')
        .select(`
            *,
            category:categories(name, slug),
            brand:brands(name, slug)
        `);

    // Sort
    if (options?.sort === 'popular') {
        // Fallback to created_at if review_count isn't reliable, but let's assume it is or use whatever metric
        query = query.order('review_count', { ascending: false });
    } else if (options?.sort === 'price_asc') {
        query = query.order('price', { ascending: true });
    } else if (options?.sort === 'price_desc') {
        query = query.order('price', { ascending: false });
    } else {
        // Default: newest
        query = query.order('created_at', { ascending: false });
    }

    // Limit
    if (options?.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    // Transform to match frontend types if needed
    return data.map(product => ({
        ...product,
        category: product.category?.name,
        categorySlug: product.category?.slug,
        inStock: product.in_stock,
    })) as Product[];
}

export async function getProductBySlug(slug: string) {
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(name, slug),
            brand:brands(name, slug),
            variants:product_options(*)
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return {
        ...data,
        category: data.category?.name,
        categorySlug: data.category?.slug,
        variants: data.variants?.map((v: any) => ({
            type: v.type,
            name: v.name,
            options: v.values
        })),
        inStock: data.in_stock,
    } as Product;
}

export async function getProductsByCategory(categorySlug: string) {
    // We need to fetch the category ID first to ensure reliable filtering
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

    if (!category) return [];

    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(name, slug),
            brand:brands(name, slug)
        `)
        .eq('category_id', category.id);

    if (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }

    return data.map(product => ({
        ...product,
        category: product.category?.name,
        categorySlug: product.category?.slug,
        inStock: product.in_stock,
    })) as Product[];
}

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    const { data, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            slug,
            price,
            images,
            category:categories(name, slug)
        `)
        .ilike('name', `%${query}%`)
        .limit(6);

    if (error) {
        console.error('Error searching products:', error);
        return [];
    }

    return (data || []).map((product: any) => ({
        ...product,
        category: Array.isArray(product.category) ? product.category[0]?.name : product.category?.name,
        categorySlug: Array.isArray(product.category) ? product.category[0]?.slug : product.category?.slug,
        inStock: true,
    })) as Product[];
}
