import { useWishlistStore } from '@/lib/store/wishlist';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const { data: allProducts = [], isLoading } = useProducts({ limit: 200 });
  const wishlistProducts = allProducts.filter((p) => productIds.includes(p.id));

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-12 md:py-16 relative overflow-hidden">
        <div className="bg-cyber-grid absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative flex items-center gap-3">
          <Heart className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Wishlist</h1>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{productIds.length} Items Saved</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSkeleton variant="product-grid" count={4} />
        ) : productIds.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-5">
            <Heart className="h-14 w-14 text-zinc-200" />
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-1">Your wishlist is empty</p>
              <p className="text-zinc-300 text-xs font-medium">Save products you love for later</p>
            </div>
            <Button asChild className="h-12 px-8 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-black transition-all">
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {wishlistProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
