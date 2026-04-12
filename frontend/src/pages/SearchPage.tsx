import { useSearchParams, Link } from 'react-router-dom';
import { useSearchProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const { data: results = [], isLoading } = useSearchProducts(q);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-12 md:py-16 relative overflow-hidden">
        <div className="bg-cyber-grid absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Search Results</p>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            {q ? `"${q}"` : 'Search'}
          </h1>
          {!isLoading && q && (
            <p className="mt-2 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
              {results.length} {results.length === 1 ? 'Result' : 'Results'}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!q ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <Search className="h-12 w-12 text-zinc-200" />
            <p className="text-zinc-400 text-sm font-medium">Enter a search term to find products.</p>
          </div>
        ) : isLoading ? (
          <LoadingSkeleton variant="product-grid" count={8} />
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-sm font-medium mb-2">No products found for "{q}"</p>
            <Link to="/products" className="text-primary font-black text-[11px] uppercase tracking-widest underline">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
