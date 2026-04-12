import { useState } from 'react';
import { useOrderById } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [searched, setSearched] = useState('');
  const { data: order, isLoading, isError } = useOrderById(searched);

  const currentStep = statusSteps.indexOf(order?.status ?? '');

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="bg-black text-white py-12 md:py-16">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Track Order</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 md:p-8 mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Enter your Order ID</p>
          <div className="flex gap-3">
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. TKL-2024-001"
              className="h-12 rounded-[5px] border-zinc-200 bg-zinc-50 text-sm font-medium flex-1"
              onKeyDown={(e) => { if (e.key === 'Enter') setSearched(orderId.trim()); }}
            />
            <Button
              onClick={() => setSearched(orderId.trim())}
              disabled={isLoading}
              className="h-12 px-5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-[5px] hover:bg-primary hover:text-black transition-all"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {searched && (
          isLoading ? (
            <div className="text-center py-10 text-zinc-400 text-sm font-medium animate-pulse">Searching…</div>
          ) : isError || !order ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
              <p className="text-red-500 font-black text-sm uppercase tracking-widest">Order not found</p>
              <p className="text-red-400 text-xs font-medium mt-1">Check your order ID and try again</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <p className="text-xs font-medium text-zinc-400">Order Number</p>
                  <p className="font-black text-black text-lg">{order.orderNumber}</p>
                </div>
                <span className={cn('px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest',
                  order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                  order.status === 'shipped' ? 'bg-purple-50 text-purple-600' :
                  order.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                  'bg-amber-50 text-amber-600'
                )}>{order.status}</span>
              </div>

              {/* Progress */}
              <div className="relative flex items-start justify-between mb-8">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-zinc-100 z-0">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%` }} />
                </div>
                {statusSteps.map((step, i) => (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all', i <= currentStep ? 'bg-primary border-primary text-black' : 'bg-white border-zinc-200 text-zinc-300')}>
                      {i < currentStep ? '✓' : <span className="text-[10px] font-black">{i + 1}</span>}
                    </div>
                    <span className={cn('text-[9px] font-black uppercase tracking-wider text-center', i <= currentStep ? 'text-black' : 'text-zinc-300')}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-100 pt-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Order Items</p>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-zinc-600 font-medium">{item.productName} × {item.quantity}</span>
                      <span className="font-black text-black">AED {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-zinc-50">
                  <span className="font-black uppercase tracking-widest text-black text-xs">Total</span>
                  <span className="font-black text-black text-base">AED {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
