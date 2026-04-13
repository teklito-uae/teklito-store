import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth';
import { useCartStore, SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/lib/store/cart';
import { useProducts } from '@/hooks/useProducts';
import { createOrder } from '@/lib/api/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppImage from '@/components/shared/AppImage';
import { getImageUrl } from '@/lib/utils/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle, Package } from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(9, 'Valid phone required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  zipCode: z.string().min(2, 'Zip/postal code required'),
  country: z.string().min(1, 'Country required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { data: allProducts = [] } = useProducts({ limit: 200 });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string; orderNumber: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { 
      country: 'UAE',
      fullName: user?.name || '',
      email: user?.email || '',
    },
  });

  const cartItems = items.map((item) => ({
    ...item,
    product: allProducts.find((p) => p.id === item.productId),
  })).filter((item) => item.product);

  const subtotal = cartItems.reduce((sum, i) => sum + (i.product!.price * i.quantity), 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;

  const onSubmit = async (data: CheckoutForm) => {
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }
    setIsSubmitting(true);
    const itemsForApi = cartItems.map((item) => {
      const product = item.product!; // Guaranteed by the filter above
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        product: product,
        selectedVariants: item.selectedVariants,
      };
    });

    try {
      const result = await createOrder({
        shippingInfo: data,
        paymentMethod,
        items: itemsForApi,
      });
      if (result.success && result.orderId) {
        clearCart();
        setOrderSuccess({ orderId: result.orderId, orderNumber: result.orderNumber! });
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll to top on success
  useEffect(() => {
    if (orderSuccess) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [orderSuccess]);

  // Success screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-2">Order Placed!</h1>
          <p className="text-zinc-500 font-medium text-sm mb-1">Thank you for your purchase</p>
          <p className="text-[11px] font-black uppercase tracking-widest text-primary">{orderSuccess.orderNumber}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {user ? (
            <Button asChild className="h-12 px-6 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-black transition-all">
              <Link to="/profile">View My Dashboard</Link>
            </Button>
          ) : (
            <Button asChild className="h-12 px-6 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-black transition-all">
              <Link to={`/track?id=${orderSuccess.orderNumber}`}>Track Your Order</Link>
            </Button>
          )}
          <Button asChild variant="outline" className="h-12 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Package className="h-12 w-12 text-zinc-200" />
        <p className="text-zinc-400 font-medium">Your cart is empty</p>
        <Button asChild><Link to="/products">Shop Now</Link></Button>
      </div>
    );
  }

  const inputClass = 'h-11 rounded-[5px] border-zinc-200 bg-zinc-50 focus:border-black focus:ring-0 text-base md:text-sm font-medium placeholder:text-zinc-400';

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-black mb-5">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">Full Name</Label>
                    <Input {...register('fullName')} placeholder="John Doe" className={inputClass} />
                    {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">Email</Label>
                    <Input {...register('email')} type="email" placeholder="john@example.com" className={inputClass} />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">Phone</Label>
                    <Input {...register('phone')} placeholder="+971 50 000 0000" className={inputClass} />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.phone.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">Address</Label>
                    <Input {...register('address')} placeholder="Street address, apartment, suite..." className={inputClass} />
                    {errors.address && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.address.message}</p>}
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">City</Label>
                    <Input {...register('city')} placeholder="Dubai" className={inputClass} />
                    {errors.city && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.city.message}</p>}
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">Zip / Postal Code</Label>
                    <Input {...register('zipCode')} placeholder="00000" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-zinc-100 p-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-black mb-5">Payment Method</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(['cod', 'card'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        paymentMethod === method ? 'border-black bg-black text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                      )}
                    >
                      <p className="text-[11px] font-black uppercase tracking-widest">{method === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</p>
                      <p className={cn('text-[10px] font-medium mt-0.5', paymentMethod === method ? 'text-zinc-300' : 'text-zinc-400')}>
                        {method === 'cod' ? 'Pay when delivered' : 'Coming soon'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-zinc-100 p-6 sticky top-24">
                <h2 className="text-sm font-black uppercase tracking-widest text-black mb-5">Order Review</h2>
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto scrollbar-hide">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden">
                        <AppImage src={getImageUrl(item.product!.images)} alt={item.product!.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-black line-clamp-1">{item.product!.name}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-black text-black shrink-0">AED {(item.product!.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-100 pt-4 space-y-2 mb-5">
                  <div className="flex justify-between text-xs"><span className="text-zinc-500">Subtotal</span><span className="font-bold">AED {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-zinc-500">Shipping</span><span className={cn('font-bold', shipping === 0 ? 'text-emerald-600' : '')}>{shipping === 0 ? 'FREE' : `AED ${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between pt-2 border-t border-zinc-100"><span className="font-black uppercase tracking-widest text-black text-xs">Total</span><span className="font-black text-black text-lg">AED {total.toFixed(2)}</span></div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-black transition-all">
                  {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Placing Order…</> : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
