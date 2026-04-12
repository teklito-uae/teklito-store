import { useParams, Link } from 'react-router-dom';
import { useProductBySlug, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import AppImage from '@/components/shared/AppImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star, Minus, Plus, ArrowLeft, Package, Shield, Truck, Users, Zap } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils/image';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';

const TABS = ['Description', 'Specifications', 'Reviews'] as const;
type Tab = typeof TABS[number];

const sampleReviews = [
  { name: 'Ahmad K.', rating: 5, comment: 'Excellent product, fast delivery!', date: '2 days ago', avatar: 'A' },
  { name: 'Sara M.', rating: 5, comment: 'Authentic and well packaged. Very happy!', date: '1 week ago', avatar: 'S' },
  { name: 'Ravi P.', rating: 4, comment: 'Great quality, matches description perfectly.', date: '2 weeks ago', avatar: 'R' },
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductBySlug(slug!);
  const { addToCart, isInCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<Tab>('Description');

  const { data: allProducts = [] } = useProducts({ limit: 40 });
  const relatedProducts = useMemo(() =>
    allProducts.filter((p) => p.categorySlug === product?.categorySlug && p.id !== product?.id).slice(0, 6),
    [allProducts, product]
  );

  // Random viewers count (social proof)
  const viewers = useMemo(() => Math.floor(Math.random() * 12) + 3, [product?.id]);

  if (isLoading) return <LoadingSkeleton variant="full-page" />;
  if (isError || !product) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-black uppercase">Product not found</h1>
      <Link to="/products" className="mt-4 inline-block text-primary font-bold underline">Back to Products</Link>
    </div>
  );

  const inCart = isInCart(product.id, selectedVariants);
  const inWishlist = isInWishlist(product.id);
  const isLowStock = product.stock > 0 && product.stock < 5;
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price : 0;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedVariants);
    toast.success('Added to cart!', { description: `${product.name} × ${quantity}` });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Products
          </Link>
          <span className="text-zinc-200">/</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{product.category}</span>
          <span className="text-zinc-200">/</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 line-clamp-1 max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Images ── */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-zinc-50 rounded-[2rem] overflow-hidden border border-zinc-100">
              <AppImage src={product.images[selectedImage] || getImageUrl(product.images)} alt={product.name} fill className="object-contain p-8" />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-primary text-black font-black shadow-sm">-{product.discount}%</Badge>
              )}
              {isLowStock && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white font-black animate-pulse">Only {product.stock} left!</Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn('relative w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all', selectedImage === i ? 'border-primary' : 'border-zinc-100 hover:border-zinc-300')}
                  >
                    <AppImage src={img} alt={`${product.name} ${i}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="space-y-5">
            {/* Category + Social proof */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{product.category}</p>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                <Users className="h-3 w-3" />
                {viewers} people viewing now
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">{product.name}</h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={cn('h-4 w-4', s <= Math.round(product.rating) ? 'fill-primary text-primary' : 'fill-zinc-100 text-zinc-200')} />
                  ))}
                </div>
                <span className="text-sm font-bold text-zinc-700">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-zinc-400">({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black text-black">AED {product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-zinc-400 line-through">AED {product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {savings > 0 && (
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">You save AED {savings.toFixed(2)}</span>
              )}
            </div>

            {/* Stock status */}
            <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest', product.inStock ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100')}>
              <span className={cn('w-1.5 h-1.5 rounded-full', product.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500')} />
              {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </div>

            {/* Flash low-stock warning */}
            {isLowStock && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <Zap className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-xs font-black text-red-600 uppercase tracking-wide">Selling fast! Only {product.stock} units left.</p>
              </div>
            )}

            {/* Variants */}
            {product.variants?.map((variant) => (
              <div key={variant.type}>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">{variant.name}</p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt.id}
                      disabled={!opt.inStock}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.type]: opt.value }))}
                      className={cn(
                        'px-4 py-2 rounded-[5px] border text-[11px] font-black uppercase tracking-wider transition-all',
                        selectedVariants[variant.type] === opt.value
                          ? 'border-black bg-black text-white'
                          : opt.inStock ? 'border-zinc-200 text-zinc-600 hover:border-black' : 'border-zinc-100 text-zinc-300 cursor-not-allowed line-through'
                      )}
                    >
                      {opt.label}
                      {opt.priceModifier && opt.priceModifier > 0 && (
                        <span className="ml-1 text-zinc-400 font-medium">+{opt.priceModifier}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-10 w-10 rounded-[5px] border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} className="h-10 w-10 rounded-[5px] border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn('flex-1 h-14 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all', inCart ? 'bg-primary text-black hover:bg-primary/90' : 'bg-black text-white hover:bg-zinc-800')}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {inCart ? 'Added to Cart ✓' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                onClick={() => { toggleWishlist(product.id); toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist'); }}
                className={cn('h-14 w-14 rounded-xl border-zinc-200', inWishlist && 'border-red-200 bg-red-50')}
              >
                <Heart className={cn('h-5 w-5', inWishlist ? 'fill-red-500 text-red-500' : 'text-zinc-400')} />
              </Button>
            </div>

            {/* Trust bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100">
              {[
                { icon: Truck, label: 'Fast Delivery', sub: '1-3 days UAE' },
                { icon: Shield, label: 'Authentic', sub: '100% Genuine' },
                { icon: Package, label: 'Free Returns', sub: 'Within 7 days' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700 text-center">{label}</span>
                  <span className="text-[8px] text-zinc-400 font-medium text-center">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-16 border-t border-zinc-100">
          <div className="flex border-b border-zinc-100">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2',
                  activeTab === tab ? 'border-primary text-black' : 'border-transparent text-zinc-400 hover:text-black'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'Description' && product.description && (
              <div className="text-sm text-zinc-600 font-medium leading-relaxed prose prose-sm max-w-2xl" dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
            {activeTab === 'Description' && !product.description && (
              <p className="text-zinc-400 text-sm">No description available.</p>
            )}

            {activeTab === 'Specifications' && (
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                {[
                  { label: 'Brand', val: product.category },
                  { label: 'Condition', val: 'Brand New' },
                  { label: 'Availability', val: product.inStock ? 'In Stock' : 'Out of Stock' },
                  { label: 'SKU', val: product.id.slice(0, 8).toUpperCase() },
                  { label: 'Rating', val: `${product.rating.toFixed(1)} / 5.0` },
                  { label: 'Reviews', val: `${product.reviewCount} verified reviews` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between gap-4 py-3 border-b border-zinc-50 text-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
                    <span className="font-bold text-black text-xs">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="max-w-2xl space-y-5">
                {/* Summary */}
                <div className="flex items-center gap-6 p-5 bg-zinc-50 rounded-2xl border border-zinc-100 mb-6">
                  <div className="text-center">
                    <p className="text-4xl font-black text-black">{product.rating.toFixed(1)}</p>
                    <div className="flex mt-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={cn('h-3.5 w-3.5', s <= Math.round(product.rating) ? 'fill-primary text-primary' : 'fill-zinc-200 text-zinc-200')} />
                      ))}
                    </div>
                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{product.reviewCount} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-zinc-400 w-4">{star}</span>
                        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '10%' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Review cards */}
                {sampleReviews.map((r) => (
                  <div key={r.name} className="p-5 rounded-2xl border border-zinc-100 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black font-black text-xs">{r.avatar}</div>
                        <div>
                          <p className="text-sm font-black text-black">{r.name}</p>
                          <div className="flex mt-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={cn('h-3 w-3', s <= r.rating ? 'fill-primary text-primary' : 'fill-zinc-200 text-zinc-200')} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{r.date}</span>
                    </div>
                    <p className="text-sm text-zinc-600 font-medium">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-zinc-100 pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black">You May Also Like</h2>
                <div className="h-0.5 w-10 bg-primary mt-1.5 rounded-full" />
              </div>
              <Link to={`/category/${product.categorySlug}`} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center gap-1">
                View All <ArrowLeft className="h-3 w-3 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky mobile CTA ── */}
      <div className="lg:hidden fixed bottom-[64px] inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-zinc-100 z-40">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn('w-full h-12 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all', inCart ? 'bg-primary text-black' : 'bg-black text-white')}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {inCart ? '✓ In Cart · Checkout' : `Add to Cart — AED ${product.price.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
