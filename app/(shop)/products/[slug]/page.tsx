import { notFound } from 'next/navigation';
import { getProductBySlug, getProductsByCategory } from '@/lib/actions/products';
import ProductDetails from '@/components/product/ProductDetails';
import { Product } from '@/lib/types';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const allRelatedProducts = await getProductsByCategory(product.categorySlug);
    const relatedProducts = allRelatedProducts
        .filter((p: Product) => p.id !== product.id)
        .slice(0, 4);

    return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}

