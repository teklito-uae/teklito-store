import { supabase } from '../supabase/client';
import { Product } from '../types';

export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(name, slug),
            brand:brands(name, slug),
            variants:product_options(*)
        `)
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching product by ID:', error);
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
        }))
    } as Product;
}
