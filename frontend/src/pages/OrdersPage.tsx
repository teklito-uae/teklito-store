import { useMyOrders } from '@/hooks/useOrders';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const statusMap = {
  pending: { label: 'Pending', class: 'bg-amber-50 text-amber-600' },
  processing: { label: 'Processing', class: 'bg-blue-50 text-blue-600' },
  shipped: { label: 'Shipped', class: 'bg-purple-50 text-purple-600' },
  delivered: { label: 'Delivered', class: 'bg-emerald-50 text-emerald-600' },
  cancelled: { label: 'Cancelled', class: 'bg-red-50 text-red-500' },
};

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useMyOrders();

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="bg-black text-white py-12 md:py-16">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">My Orders</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSkeleton variant="product-card" count={3} />
        ) : orders.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-5">
            <Package className="h-14 w-14 text-zinc-200" />
            <p className="text-zinc-400 text-sm font-medium">No orders yet</p>
            <Link to="/products" className="text-primary font-black text-[11px] uppercase tracking-widest underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {orders.map((order) => {
              const status = statusMap[order.status] ?? { label: order.status, class: 'bg-zinc-100 text-zinc-600' };
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-zinc-100 p-5 md:p-6 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className="font-black text-black text-sm">{order.orderNumber}</p>
                      <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider', status.class)}>{status.label}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium">
                      {new Date(order.date).toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {' · '}{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-black text-base">AED {order.total.toFixed(2)}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-300 shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
