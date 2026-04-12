import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppImage from '@/components/shared/AppImage';
import { getImageUrl } from '@/lib/utils/image';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart, isInCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const isBestSeller = product.reviewCount > 100 || product.rating >= 4.8;
  const isLowStock = product.stock > 0 && product.stock < 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast.success('Added to cart', { description: product.name, duration: 2000 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', { duration: 1500 });
  };

  return (
    <Link to={`/products/${product.slug}`} className={cn('group block', className)}>
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:border-zinc-200 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-zinc-50 overflow-hidden">
          <AppImage
            src={getImageUrl(product.images)}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Shine overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
          </div>

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discount && product.discount > 0 && (
              <Badge className="bg-primary text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                -{product.discount}%
              </Badge>
            )}
            {isBestSeller && !product.discount && (
              <Badge className="bg-black text-primary text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                <Zap className="h-2.5 w-2.5 mr-0.5 inline" /> Best Seller
              </Badge>
            )}
            {isLowStock && (
              <Badge className="bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md animate-pulse">
                Only {product.stock} left!
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="bg-zinc-900 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Free shipping badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[8px] font-black uppercase tracking-wider text-zinc-600 px-2 py-0.5 rounded-full border border-zinc-100">
              <Truck className="h-2.5 w-2.5 text-primary" /> Free Shipping
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all shadow-sm',
              inWishlist ? 'bg-red-50 text-red-500' : 'bg-white/80 text-zinc-400 hover:text-red-500 hover:bg-red-50'
            )}
          >
            <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
          </button>

          {/* Quick add overlay */}
          <div className="absolute inset-x-3 bottom-12 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={cn(
                'w-full h-9 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md',
                inCart
                  ? 'bg-primary text-black hover:bg-primary/90'
                  : 'bg-black text-white hover:bg-zinc-800'
              )}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
              {inCart ? 'In Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-sm font-bold text-black line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors flex-1">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    className={cn('h-2.5 w-2.5', s <= Math.round(product.rating) ? 'fill-primary text-primary' : 'fill-zinc-100 text-zinc-200')}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-zinc-600">{product.rating.toFixed(1)}</span>
              <span className="text-[9px] text-zinc-400 font-medium">({product.reviewCount})</span>
            </div>
          )}

          {/* Price + savings */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-black text-black">AED {product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through font-medium">AED {product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {savings > 0 && (
            <span className="mt-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">
              Save AED {savings.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
