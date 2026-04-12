import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCategoryBySlug } from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { cn } from '@/lib/utils';
import type { SortOption } from '@/lib/types';

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Price: Low', value: 'price_asc' },
  { label: 'Price: High', value: 'price_desc' },
];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = (searchParams.get('sort') as SortOption) || 'newest';

  const { data: category } = useCategoryBySlug(slug!);
  const { data: products = [], isLoading } = useProducts({ category: slug, sort });

  const setSort = (s: SortOption) => {
    setSearchParams({ sort: s });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="bg-black text-white py-12 md:py-16 relative overflow-hidden">
        <div className="bg-cyber-grid absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Browse</p>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            {category?.name || slug?.replace(/-/g, ' ')}
          </h1>
          {category?.description && (
            <p className="mt-3 text-zinc-400 text-sm font-medium max-w-xl">{category.description}</p>
          )}
          <p className="mt-2 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
            {products.length} Products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Sort bar */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto scrollbar-hide pb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Sort:</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={cn(
                'px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 transition-all',
                sort === opt.value
                  ? 'bg-black text-white border-black'
                  : 'border-zinc-200 text-zinc-500 hover:border-black hover:text-black'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Products */}
        {isLoading ? (
          <LoadingSkeleton variant="product-grid" count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-sm font-medium">No products found in this category.</p>
            <Link to="/products" className="mt-4 inline-block text-primary font-black text-[11px] uppercase tracking-widest underline">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
