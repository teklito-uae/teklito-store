import { useCartStore, SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/lib/store/cart';
import { useProducts } from '@/hooks/useProducts';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield, Package, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppImage from '@/components/shared/AppImage';
import { getImageUrl } from '@/lib/utils/image';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/shared/EmptyState';
import ProductCard from '@/components/product/ProductCard';
import { useAuthStore } from '@/lib/store/auth';
import { useMemo, useState } from 'react';

const trustItems = [
  { icon: Shield, label: 'Secure Payment', sub: 'SSL Encrypted' },
  { icon: Package, label: 'Easy Returns', sub: '7-day policy' },
  { icon: Clock, label: 'Fast Dispatch', sub: 'Same day' },
];

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getItemCount } = useCartStore();
  const { user } = useAuthStore();
  const { data: allProducts = [] } = useProducts({ limit: 200 });
  const navigate = useNavigate();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const cartItems = items.map((item) => ({
    ...item,
    product: allProducts.find((p) => p.id === item.productId),
  })).filter((item) => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;
  const itemCount = getItemCount();

  const totalSavings = cartItems.reduce((s, item) => {
    const orig = item.product!.originalPrice ?? item.product!.price;
    return s + (orig - item.product!.price) * item.quantity;
  }, 0);

  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

  const suggested = useMemo(() => allProducts
    .filter(p => !items.some(i => i.productId === p.id))
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, 4),
    [allProducts, items]
  );

  if (itemCount === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet. Browse our premium tech collection."
        actionLabel="Continue Shopping"
        actionTo="/products"
      />
    );
  }

  // Estimated delivery
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryStr = deliveryDate.toLocaleDateString('en-AE', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mb-8">
          Shopping Cart <span className="text-zinc-400 font-medium">({itemCount})</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.product!;
              return (
                <div key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`} className="bg-white rounded-2xl border border-zinc-100 p-4 md:p-6 flex gap-4 md:gap-6 hover:border-zinc-200 hover:shadow-md hover:shadow-black/5 transition-all">
                  <Link to={`/products/${product.slug}`} className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
                    <AppImage src={getImageUrl(product.images)} alt={product.name} fill className="object-contain p-2" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-black text-sm md:text-base text-black line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{product.category}</p>
                    {item.selectedVariants && Object.entries(item.selectedVariants).map(([k, v]) => (
                      <p key={k} className="text-[10px] text-zinc-500 font-medium capitalize">{k}: <span className="font-bold">{v}</span></p>
                    ))}

                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                        Saving AED {((product.originalPrice - product.price) * item.quantity).toFixed(2)}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                      <div className="flex items-center gap-1 border border-zinc-200 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariants)} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-zinc-100 transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariants)} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-zinc-100 transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="font-black text-black text-base">AED {(product.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.productId, item.selectedVariants)} className="text-zinc-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-zinc-100 p-6 sticky top-24">
              <h2 className="text-sm font-black uppercase tracking-widest text-black mb-5">Order Summary</h2>

              {/* Free shipping progress */}
              {subtotal < SHIPPING_THRESHOLD && (
                <div className="mb-5 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Free shipping progress</span>
                    <span className="text-[9px] font-black text-primary">AED {(SHIPPING_THRESHOLD - subtotal).toFixed(2)} away</span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
                  </div>
                </div>
              )}

              {shipping === 0 && (
                <div className="mb-5 flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl px-3 py-2.5">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">🎉 Free shipping unlocked!</span>
                </div>
              )}

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Subtotal ({itemCount} items)</span>
                  <span className="font-bold text-black">AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Shipping</span>
                  <span className={cn('font-bold', shipping === 0 ? 'text-emerald-600' : 'text-black')}>
                    {shipping === 0 ? 'FREE' : `AED ${shipping.toFixed(2)}`}
                  </span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-sm bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
                    <span className="text-emerald-700 font-bold text-xs">You're saving</span>
                    <span className="font-black text-emerald-700 text-xs">AED {totalSavings.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-100 pt-4 pb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-black uppercase tracking-widest text-black text-sm">Total</span>
                  <span className="font-black text-black text-xl">AED {total.toFixed(2)}</span>
                </div>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Estimated delivery by {deliveryStr}
                </p>
              </div>

              <Button onClick={() => user ? navigate('/checkout') : setShowGuestModal(true)} className="w-full h-13 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 mb-3">
                Checkout <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {trustItems.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 text-center leading-tight">{label}</span>
                    <span className="text-[7px] text-zinc-400 font-medium text-center">{sub}</span>
                  </div>
                ))}
              </div>

              <Link to="/products" className="block text-center text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* ── You May Also Like ── */}
        {suggested.length > 0 && (
          <div className="mt-16 pt-12 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-black">Customers Also Bought</h2>
                <div className="h-0.5 w-10 bg-primary mt-1.5 rounded-full" />
              </div>
              <Link to="/products" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggested.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Guest Checkout Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 relative shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2 text-center">Ready to Checkout?</h3>
            <p className="text-sm font-medium text-zinc-500 mb-8 text-center">Signing in speeds up checkout and lets you track all future orders instantly.</p>
            
            <div className="space-y-3">
              <Button onClick={() => navigate('/login')} className="w-full h-12 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-xl">
                Sign In & Checkout
              </Button>
              <Button onClick={() => navigate('/checkout')} variant="outline" className="w-full h-12 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-50">
                Continue as Guest
              </Button>
            </div>
            
            <button onClick={() => setShowGuestModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors">
              <Plus className="h-6 w-6 rotate-45" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
