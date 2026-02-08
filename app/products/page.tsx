import ProductArchive from '@/components/product/ProductArchive';
import { getProducts } from '@/lib/actions/products';
import { getCategories } from '@/lib/actions/categories';

export default async function ProductsPage() {
    const products = await getProducts();
    const categories = await getCategories();

    return <ProductArchive initialProducts={products} categories={categories} />;
}
