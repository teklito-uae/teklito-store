import { supabase } from '../supabase/client';
import { Category } from '../types';

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .order('name');
    console.log("teklito-categories", data);

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data as Category[];
}

export async function getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching category by slug:', error);
        return null;
    }

    return data as Category;
}

export async function getCategoryMetadata(slug: string) {
    // First get the category ID
    const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single();

    if (!category) return { subcategories: [], brands: [] };

    // Fetch subcategories
    const { data: subcategories } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('parent_id', category.id);

    // Fetch brands that have products in this category
    const { data: productsInCat } = await supabase
        .from('products')
        .select('brand_id')
        .eq('category_id', category.id);

    const brandIds = productsInCat?.map(p => p.brand_id).filter(id => id !== null) || [];

    let brands = [];
    if (brandIds.length > 0) {
        const { data: brandsData } = await supabase
            .from('brands')
            .select('name, slug, icon')
            .in('id', brandIds);
        brands = brandsData || [];
    } else {
        // Fallback: Fetch any brands to show something
        const { data: fallbackBrands } = await supabase
            .from('brands')
            .select('name, slug, icon')
            .limit(12);
        brands = fallbackBrands || [];
    }

    return {
        subcategories: subcategories || [],
        brands: brands
    };
}
