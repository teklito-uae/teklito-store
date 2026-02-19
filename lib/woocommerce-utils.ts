import { Product, Category } from './types';

export function mapWooCommerceProduct(wpProduct: any): Product {
    const price = parseFloat(wpProduct.price || '0');
    const regularPrice = parseFloat(wpProduct.regular_price || '0');

    return {
        id: String(wpProduct.id),
        name: wpProduct.name,
        slug: wpProduct.slug,
        description: wpProduct.description,
        price: price,
        originalPrice: regularPrice > price ? regularPrice : undefined,
        discount: regularPrice > price ? Math.round(((regularPrice - price) / regularPrice) * 100) : undefined,
        images: wpProduct.images?.map((img: any) => img.src) || [],
        category: wpProduct.categories?.[0]?.name || 'Uncategorized',
        categorySlug: wpProduct.categories?.[0]?.slug || 'uncategorized',
        rating: parseFloat(wpProduct.average_rating || '0'),
        reviewCount: wpProduct.rating_count || 0,
        inStock: wpProduct.stock_status === 'instock',
        stock: wpProduct.stock_quantity || 0,
        tags: wpProduct.tags?.map((t: any) => t.name) || [],
        createdAt: wpProduct.date_created,
        variants: wpProduct.attributes?.map((attr: any) => ({
            type: attr.name.toLowerCase(),
            name: attr.name,
            options: attr.options.map((opt: string) => ({
                id: opt,
                value: opt,
                label: opt,
                inStock: true
            }))
        }))
    };
}

export function mapWooCommerceCategory(wpCategory: any): Category {
    return {
        id: String(wpCategory.id),
        name: wpCategory.name,
        slug: wpCategory.slug,
        image: wpCategory.image?.src || '',
        productCount: wpCategory.count || 0,
        description: wpCategory.description || ''
    };
}
