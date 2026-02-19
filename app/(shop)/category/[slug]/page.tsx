import { notFound } from 'next/navigation';
import { getProductsByCategory } from '@/lib/actions/products';
import { getCategoryBySlug, getCategoryMetadata } from '@/lib/actions/categories';
import CategoryArchive from '@/components/category/CategoryArchive';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [category, products, metadata] = await Promise.all([
        getCategoryBySlug(slug),
        getProductsByCategory(slug),
        getCategoryMetadata(slug)
    ]);

    if (!category) {
        notFound();
    }

    return (
        <CategoryArchive
            category={category}
            products={products}
            metadata={metadata || { subcategories: [], brands: [] }}
        />
    );
}
