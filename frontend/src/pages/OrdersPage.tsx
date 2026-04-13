import { useMyOrders } from '@/hooks/useOrders';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { Package, ChevronRight, MapPin, CreditCard, Clock, Calendar, CheckCircle2, Box, Truck, HelpCircle, Settings, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const statusMap = {
  pending: { label: 'Order Received', icon: Clock, class: 'bg-amber-50 text-amber-600 border-amber-100' },
  processing: { label: 'Processing', icon: Settings, class: 'bg-blue-50 text-blue-600 border-blue-100' },
  shipped: { label: 'On its Way', icon: Truck, class: 'bg-purple-50 text-purple-600 border-purple-100' },
  delivered: { label: 'Delivered', icon: CheckCircle2, class: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  cancelled: { label: 'Cancelled', icon: AlertCircle, class: 'bg-red-50 text-red-500 border-red-100' },
};

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useMyOrders();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="bg-black text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px] rounded-full -mr-20 -mt-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Your Account</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Order History</h1>
              <p className="text-zinc-500 text-sm font-medium mt-2 max-w-md leading-relaxed">
                Track status, manage returns, and see all your premium tech purchases in one place.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-4 rounded-2xl">
              <div className="text-center px-4 border-r border-zinc-800">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Orders</p>
                <p className="text-xl font-black text-white">{orders.length}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Active</p>
                <p className="text-xl font-black text-primary">{orders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white rounded-3xl border border-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-zinc-100 max-w-2xl mx-auto shadow-sm">
            <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Box className="h-10 w-10 text-zinc-200" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-black mb-2">No orders found</h2>
            <p className="text-zinc-400 text-sm font-medium mb-8">You haven't placed any orders with us yet.</p>
            <Button asChild className="h-12 px-8 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-black transition-all">
              <Link to="/products">Explore Latest Tech</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order: any) => {
              const orderStatus = order.status || 'pending';
              const status = statusMap[orderStatus as keyof typeof statusMap] ?? { label: orderStatus, icon: Package, class: 'bg-zinc-100 text-zinc-600 border-zinc-200' };
              const isExpanded = expandedId === order.id;
              
              const dateStr = order.created_at || order.createdAt || order.date;
              const date = dateStr ? new Date(dateStr).toLocaleDateString('en-AE', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }) : 'N/A';

              const orderItems = order.items || [];
              let shippingAddr: any = {};
              const rawShipping = order.shipping_address || order.shippingAddress || {};
              
              try {
                shippingAddr = typeof rawShipping === 'string' 
                  ? JSON.parse(rawShipping) 
                  : rawShipping;
              } catch (e) {
                shippingAddr = rawShipping;
              }

              return (
                <div key={order.id} className="bg-white rounded-[32px] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group">
                  <div 
                    onClick={() => toggleExpand(order.id)}
                    className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 flex-wrap mb-3">
                        <span className="text-[11px] font-black text-black bg-zinc-50 border border-zinc-100 px-3 py-1 rounded-full uppercase tracking-widest">
                          {order.order_number || order.orderNumber}
                        </span>
                        <div className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border', status.class)}>
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-[11px] font-medium text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5" />
                          {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-10">
                      {(() => {
                        const calculatedSubtotal = orderItems.reduce((sum: number, item: any) => {
                          const price = item.price || item.product?.price || 0;
                          return sum + (Number(price) * (item.quantity || 1));
                        }, 0);
                        const shipping = Number(order.shipping || 0);
                        const derivedTotal = calculatedSubtotal + shipping;

                        return (
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Amount</p>
                            <p className="text-2xl font-black text-black">AED {derivedTotal.toFixed(2)}</p>
                          </div>
                        );
                      })()}
                      <div className={cn('h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center transition-all duration-300 border border-zinc-100', isExpanded ? 'rotate-180 bg-black text-white' : 'group-hover:bg-zinc-100')}>
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 md:px-8 pb-8 pt-2 border-t border-zinc-50">
                          <div className="grid md:grid-cols-3 gap-10">
                            <div className="md:col-span-2 space-y-4">
                              <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                                <Box className="h-4 w-4 text-primary" />
                                Order Items
                              </h3>
                              <div className="space-y-3">
                                {orderItems.map((item: any, idx: number) => {
                                  const productImage = item.product?.images?.[0] || item.product_image;
                                  const currentPrice = item.price || item.product?.price || 0;
                                  const currentName = item.product_name || item.productName || item.product?.name || "Product";
                                  
                                  return (
                                    <div key={idx} className="flex items-center gap-4 bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100/50">
                                      <div className="h-14 w-14 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
                                        {productImage ? (
                                          <img src={productImage} alt={currentName} className="w-full h-full object-cover" />
                                        ) : (
                                          <Package className="h-6 w-6 text-zinc-200" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-black truncate">{currentName}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">AED {Number(currentPrice).toFixed(2)}</p>
                                        </div>
                                      </div>
                                      <p className="text-sm font-black text-black shrink-0">AED {(Number(currentPrice) * (item.quantity || 1)).toFixed(2)}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="p-5 bg-zinc-50 rounded-[24px] border border-zinc-100">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  Shipping Address
                                </h3>
                                <div className="space-y-1">
                                  <p className="text-xs font-black text-black">
                                    {shippingAddr.fullName || shippingAddr.full_name || shippingAddr.name || 'N/A'}
                                  </p>
                                  <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                                    {shippingAddr.address || shippingAddr.address_line1 || shippingAddr.addressLine1 || 'No address'}<br />
                                    {shippingAddr.city || 'No city'}, {shippingAddr.zipCode || shippingAddr.zip_code || shippingAddr.zip || ''}<br />
                                    {shippingAddr.country || 'UAE'}<br />
                                    {shippingAddr.phone || 'No phone'}
                                  </p>
                                </div>
                              </div>

                              <div className="p-5 bg-zinc-50 rounded-[24px] border border-zinc-100">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-primary" />
                                  Payment Method
                                </h3>
                                <p className="text-[10px] font-black text-black uppercase tracking-widest">
                                  {(() => {
                                    const method = (order.payment_method || order.paymentMethod || '').toLowerCase();
                                    if (method === 'cod') return 'Cash on Delivery';
                                    if (method === 'card') return 'Card Payment';
                                    return method || 'Online Payment';
                                  })()}
                                </p>
                              </div>

                              <Button asChild variant="outline" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200 hover:bg-zinc-50 transition-all flex items-center gap-2">
                                <Link to="/contact">
                                  <HelpCircle className="h-4 w-4" /> Need Help?
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4">Quality & Trust Guaranteed</p>
            <div className="flex items-center justify-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                <img src="/images/teklito-logo.webp" alt="Partner" className="h-5 w-auto" />
                <img src="/images/teklito-logo.webp" alt="Partner" className="h-5 w-auto" />
                <img src="/images/teklito-logo.webp" alt="Partner" className="h-5 w-auto" />
            </div>
        </div>
      </div>
    </div>
  );
}
