import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrderById } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Search, Calendar, MapPin, CreditCard, Truck, CheckCircle2, Clock, Settings, AlertCircle, Box, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/utils/image';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
const statusMap = {
  pending: { label: 'Order Received', icon: Clock, class: 'bg-amber-50 text-amber-600 border-amber-100' },
  processing: { label: 'Processing', icon: Settings, class: 'bg-blue-50 text-blue-600 border-blue-100' },
  shipped: { label: 'On its Way', icon: Truck, class: 'bg-purple-50 text-purple-600 border-purple-100' },
  delivered: { label: 'Delivered', icon: CheckCircle2, class: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  cancelled: { label: 'Cancelled', icon: AlertCircle, class: 'bg-red-50 text-red-500 border-red-100' },
};

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const urlId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(urlId);
  const [searched, setSearched] = useState(urlId);
  const { data: orderData, isLoading, isError } = useOrderById(searched);
  const order = orderData as any;

  useEffect(() => {
    if (urlId) {
      setSearched(urlId);
      setOrderId(urlId);
    }
  }, [urlId]);

  const currentStep = statusSteps.indexOf(order?.status ?? '');

  const orderItems = order?.items || [];
  let shippingAddr = order?.shipping_address || order?.shippingAddress || {};
  try {
    if (typeof shippingAddr === 'string') shippingAddr = JSON.parse(shippingAddr);
  } catch (e) { }

  const dateStr = order?.created_at || order?.createdAt || order?.date;
  const dateStrFormatted = dateStr ? new Date(dateStr).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'N/A';

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <div className="bg-black text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -mr-20 -mt-20" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <ArrowLeft className="h-3 w-3" /> Back to Store
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Track Order</h1>
          <p className="text-zinc-500 text-sm font-medium mt-2 max-w-md">Track your premium tech delivery in real-time.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-4xl">
        <div className="bg-white rounded-[32px] border border-zinc-100 p-6 md:p-10 shadow-2xl shadow-black/5 mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4 ml-1">Order Identification</p>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="TKL-XXXX-XXXXXX"
                className="h-14 pl-12 rounded-2xl border-zinc-100 bg-zinc-50 text-base md:text-sm font-black uppercase tracking-widest placeholder:text-zinc-300 focus:border-black transition-all"
                onKeyDown={(e) => { if (e.key === 'Enter') setSearched(orderId.trim()); }}
              />
            </div>
            <Button
              onClick={() => setSearched(orderId.trim())}
              disabled={isLoading}
              className="h-14 px-8 bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary hover:text-black transition-all shadow-xl shadow-black/10"
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Check Status</span>
            </Button>
          </div>
        </div>

        {searched && (
          isLoading ? (
            <div className="bg-white rounded-[32px] border border-zinc-100 p-20 flex flex-col items-center gap-4">
              <div className="h-12 w-12 border-4 border-zinc-100 border-t-black rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Locating your package...</p>
            </div>
          ) : isError || !order ? (
            <div className="bg-red-50 border border-red-100 rounded-[32px] p-10 text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight text-red-600 mb-1">Order Not Found</h2>
              <p className="text-red-400 text-xs font-medium">Verify your Order ID and try again</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Status Block */}
              <div className="bg-white rounded-[32px] border border-zinc-100 p-6 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Current Progress</p>
                    <h2 className="text-2xl font-black text-black">
                      {statusMap[order.status as keyof typeof statusMap]?.label || order.status}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {dateStrFormatted}</span>
                      <span className="h-1 w-1 rounded-full bg-zinc-300" />
                      <span className="text-black">{order.order_number || order.orderNumber}</span>
                    </div>
                  </div>
                  <div className={cn('h-16 w-16 rounded-2xl flex items-center justify-center border', statusMap[order.status as keyof typeof statusMap]?.class || 'bg-zinc-100')}>
                    {(() => {
                      const Icon = statusMap[order.status as keyof typeof statusMap]?.icon || Package;
                      return <Icon className="h-8 w-8" />;
                    })()}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative py-4 mb-2">
                  <div className="absolute top-1/2 left-0 w-full h-1.5 bg-zinc-100 -translate-y-1/2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(5, ((currentStep + 1) / statusSteps.length) * 100)}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, i) => (
                      <div key={step} className="flex flex-col items-center gap-3">
                        <div className={cn('h-10 w-10 rounded-full border-4 flex items-center justify-center transition-all bg-white relative z-10', i <= currentStep ? 'border-primary' : 'border-zinc-100')}>
                          {i < currentStep ? (
                            <CheckCircle2 className="h-6 w-6 text-primary fill-primary/10" />
                          ) : (
                            <span className={cn('text-[10px] font-black', i === currentStep ? 'text-black' : 'text-zinc-300')}>{i + 1}</span>
                          )}
                        </div>
                        <span className={cn('text-[10px] font-black uppercase tracking-widest transition-colors', i <= currentStep ? 'text-black' : 'text-zinc-300')}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Two Column details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[32px] border border-zinc-100 p-8">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-6 flex items-center gap-2">
                    <Box className="h-4 w-4 text-primary" /> Package Contents
                  </h3>
                  <div className="space-y-4">
                    {orderItems.map((item: any, i: number) => {
                      // Robust price lookup: stored price -> product price -> 0
                      const basePrice = Number(item.price || 0);
                      const productPrice = Number(item.product?.price || 0);
                      const currentPrice = basePrice || productPrice;

                      let itemImg = '';
                      if (item.product?.images) {
                        const imgs = typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images;
                        itemImg = Array.isArray(imgs) ? imgs[0] : imgs;
                      }

                      return (
                        <div key={i} className="flex gap-4 items-center bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100/50">
                          <div className="h-16 w-16 bg-white rounded-xl border border-zinc-100 overflow-hidden shrink-0 relative">
                            <img src={getImageUrl([itemImg])} alt={item.productName} className="object-contain p-2 w-full h-full" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-black line-clamp-1">{item.productName || item.product_name || 'Product'}</p>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-black text-black whitespace-nowrap">AED {(currentPrice * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 space-y-3 border-t border-zinc-50 pt-6">
                    {(() => {
                      // Recalculate if API returns 0 or mismatching
                      // We check item.price, item.product.price, and item.product.price (snake)
                      const calcSubtotal = orderItems.reduce((sum: number, item: any) => {
                        const price = Number(item.price) || Number(item.product?.price) || 0;
                        const qty = Number(item.quantity || 1);
                        return sum + (price * qty);
                      }, 0);
                      
                      const apiSubtotal = Number(order.subtotal || 0);
                      const finalSubtotal = apiSubtotal || calcSubtotal;
                      
                      const finalShipping = Number(order.shipping || 0);
                      const apiTotal = Number(order.total || 0);
                      
                      // If subtotal was corrected, total must be corrected too
                      const finalTotal = (apiSubtotal > 0 && apiTotal > 0) ? apiTotal : (finalSubtotal + finalShipping);

                      return (
                        <>
                          <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-zinc-600">AED {finalSubtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            <span>Shipping Fees</span>
                            <span className="text-zinc-600">AED {finalShipping.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-zinc-50/50">
                            <span className="text-xs font-black uppercase tracking-widest text-black">Total Amount Paid</span>
                            <span className="text-2xl font-black text-black">
                              AED {finalTotal.toFixed(2)}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-white rounded-[32px] border border-zinc-100 p-8 flex flex-col">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-6 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Shipping To
                  </h3>
                  <div className="flex-1">
                    <p className="text-base font-black text-black mb-2">{shippingAddr.fullName || shippingAddr.full_name || 'N/A'}</p>
                    <p className="text-sm font-medium text-zinc-500 leading-relaxed mb-6">
                      {shippingAddr.address || 'No address'}<br />
                      {shippingAddr.city || 'No city'}, {shippingAddr.country || 'UAE'}
                    </p>
                    <div className="flex items-center gap-3 text-sm font-bold text-zinc-900 bg-zinc-50 p-3 rounded-xl border border-zinc-100 inline-flex">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="uppercase tracking-widest text-[10px]">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                      </span>
                    </div>
                  </div>

                  <Button asChild className="w-full h-14 mt-8 bg-zinc-50 text-zinc-900 border-zinc-100 hover:bg-zinc-100 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all">
                    <Link to="/contact">Need Help With Your Order?</Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
