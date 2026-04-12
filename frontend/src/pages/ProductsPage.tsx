import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { cn } from '@/lib/utils';
import type { SortOption } from '@/lib/types';

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = (searchParams.get('sort') as SortOption) || 'newest';

  const { data: products = [], isLoading } = useProducts({ sort, limit: 60 });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-12 md:py-16 relative overflow-hidden">
        <div className="bg-cyber-grid absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Explore</p>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">All Products</h1>
          <p className="mt-2 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">{products.length} Items</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 overflow-x-auto scrollbar-hide pb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">Sort:</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSearchParams({ sort: opt.value })}
              className={cn(
                'px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 transition-all',
                sort === opt.value ? 'bg-black text-white border-black' : 'border-zinc-200 text-zinc-500 hover:border-black hover:text-black'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <LoadingSkeleton variant="product-grid" count={12} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
