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

  const productImages = useMemo(() => {
    if (!product) return [];
    const imgs = product.images as any;
    if (typeof imgs === 'string') {
      try {
        const parsed = JSON.parse(imgs);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return [imgs];
      }
    }
    return Array.isArray(imgs) ? imgs : [];
  }, [product]);

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
        <div className="flex items-center gap-2 mb-6 lg:mb-10">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            <ArrowLeft className="h-3 w-3 lg:h-3.5 lg:w-3.5" /> Products
          </Link>
          <span className="text-zinc-200">/</span>
          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-400">{product.category}</span>
          <span className="text-zinc-200">/</span>
          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-600 line-clamp-1 max-w-[150px] lg:max-w-[300px]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Images ── */}
          <div className="space-y-4">
            <div className="relative aspect-square lg:aspect-[4/3] max-h-[420px] lg:max-h-[520px] bg-zinc-50 rounded-3xl lg:rounded-[2.5rem] overflow-hidden border border-zinc-100/50">
              <AppImage src={productImages[selectedImage] || getImageUrl(productImages)} alt={product.name} fill className="object-contain p-6 md:p-12" />
              {product.discount && (
                <Badge className="absolute top-6 left-6 bg-primary text-black font-black shadow-sm ring-4 ring-white/10 px-3 py-1">-{product.discount}% OFF</Badge>
              )}
              {isLowStock && (
                <Badge className="absolute top-6 right-6 bg-red-500 text-white font-black animate-pulse px-3 py-1 shadow-md">Limited Stock</Badge>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mask-linear-right">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn('relative w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all', selectedImage === i ? 'border-primary' : 'border-zinc-100 hover:border-zinc-300')}
                  >
                    <AppImage src={img} alt={`${product.name} ${i}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col">
            {/* Category + Social proof */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{product.category}</p>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">
                <Users className="h-3 w-3" />
                {viewers} Viewing
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tight text-black mb-3 leading-tight">{product.name}</h1>

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
            <div className="flex items-center gap-4 py-2 border-y border-zinc-100/50 my-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-black">AED {product.price.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-zinc-400 line-through">AED {product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                {savings > 0 && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Save AED {savings.toFixed(2)}</span>
                )}
              </div>
              <div className="h-10 w-px bg-zinc-100 mx-1 lg:block hidden" />
              <div className={cn('hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest', product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>
                <span className={cn('w-1.5 h-1.5 rounded-full', product.inStock ? 'bg-emerald-500' : 'bg-red-500')} />
                {product.inStock ? 'Ready for shipping' : 'Check back later'}
              </div>
            </div>

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
                        'px-4 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-300',
                        selectedVariants[variant.type] === opt.value
                          ? 'border-black bg-black text-white shadow-md'
                          : opt.inStock ? 'border-zinc-200 text-zinc-600 hover:border-black bg-white' : 'border-zinc-100 text-zinc-300 cursor-not-allowed bg-zinc-50/50'
                      )}
                    >
                      {opt.label}
                      {opt.priceModifier && opt.priceModifier > 0 && (
                        <span className={cn('ml-1.5 font-bold', selectedVariants[variant.type] === opt.value ? 'text-primary' : 'text-zinc-400')}>
                          +{opt.priceModifier}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="flex items-center gap-6 py-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Quantity</p>
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl w-fit">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="h-10 w-10 rounded-xl bg-zinc-900 text-primary flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-lg"
                  >
                    <Minus className="h-4 w-4 stroke-[3]" />
                  </button>
                  <span className="w-10 text-center font-black text-xl text-black">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))} 
                    className="h-10 w-10 rounded-xl bg-zinc-900 text-primary flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-lg"
                  >
                    <Plus className="h-4 w-4 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Stock status inline for web */}
              <div className="flex-1 lg:block hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Availability</p>
                <div className={cn('inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest', product.inStock ? 'text-emerald-600' : 'text-red-500')}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', product.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500')} />
                  {product.inStock ? `${product.stock} Units Available` : 'Out of Stock'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn('flex-1 h-14 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg transition-all', inCart ? 'bg-primary text-black hover:bg-primary/95' : 'bg-black text-white hover:bg-zinc-800')}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {inCart ? 'Checkout Now' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                onClick={() => { toggleWishlist(product.id); toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist'); }}
                className={cn('h-14 w-14 rounded-2xl border-zinc-200 hover:bg-zinc-50 transition-colors', inWishlist && 'border-red-200 bg-red-50 hover:bg-red-100/50')}
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
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-2 max-w-3xl">
                {[
                  { label: 'Brand', val: product.category },
                  { label: 'Condition', val: 'New' },
                  { label: 'Availability', val: product.inStock ? 'In Stock' : 'Out of Stock' },
                  { label: 'SKU', val: product.id?.slice(0, 8).toUpperCase() || 'N/A' },
                  { label: 'Type', val: 'Official UAE Version' },
                  { label: 'Warranty', val: '1 Year Manufacturer' },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center py-3 border-b border-zinc-100/50">
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
