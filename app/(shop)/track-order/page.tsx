'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getOrderById } from '@/lib/actions/orders';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) {
            toast.error('Please enter an order ID');
            return;
        }

        setLoading(true);
        try {
            const data = await getOrderById(orderId);
            if (data) {
                setOrder(data);
            } else {
                toast.error('Order not found. Please check the ID and try again.');
                setOrder(null);
            }
        } catch (error) {
            toast.error('Failed to track order');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { status: 'pending', label: 'Order Placed', icon: Clock },
        { status: 'processing', label: 'Processing', icon: Package },
        { status: 'shipped', label: 'Shipped', icon: Truck },
        { status: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const getStatusIndex = (status: OrderStatus) => {
        const index = steps.findIndex(step => step.status === status);
        return index !== -1 ? index : 0;
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 font-poppins">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Track Order</h1>
                    <p className="text-zinc-500 max-w-md mx-auto">Enter your order ID to see the current status of your shipment.</p>
                </div>

                <Card className="border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden rounded-[2rem] mb-12">
                    <CardContent className="p-8 md:p-12">
                        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Order ID (e.g. 1234)"
                                    className="pl-12 h-14 bg-zinc-50 border-zinc-100 focus:bg-white transition-all rounded-xl font-bold"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-14 px-8 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-xs rounded-xl"
                            >
                                {loading ? 'Tracking...' : 'Track Now'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {order && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {/* Status Stepper */}
                        <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 md:p-12 shadow-sm">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Order Status</p>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">{order.status}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Order #</p>
                                    <p className="font-bold">{order.orderNumber}</p>
                                </div>
                            </div>

                            {order.status === 'cancelled' ? (
                                <div className="flex items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100">
                                    <div className="text-center">
                                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                        <h3 className="font-black uppercase tracking-tight text-red-900 mb-1">Order Cancelled</h3>
                                        <p className="text-sm text-red-600 font-medium">This order has been cancelled. Please contact support for more details.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 hidden md:block" />
                                    <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                                        {steps.map((step, index) => {
                                            const isCompleted = index <= getStatusIndex(order.status);
                                            const isCurrent = index === getStatusIndex(order.status);
                                            const Icon = step.icon;

                                            return (
                                                <div key={step.status} className="flex flex-row md:flex-col items-center gap-4 md:gap-4 flex-1">
                                                    <div className={`
                                                        h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500
                                                        ${isCompleted ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}
                                                        ${isCurrent ? 'ring-4 ring-zinc-100 scale-110' : ''}
                                                    `}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="text-left md:text-center">
                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-zinc-400'}`}>
                                                            {step.label}
                                                        </p>
                                                        {isCurrent && <p className="text-[8px] font-bold text-zinc-500 mt-0.5">ESTIMATED ARRIVAL IN 2-3 DAYS</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Details */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-widest mb-6">Order Items</h3>
                                <div className="space-y-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.productId} className="flex justify-between items-center text-sm">
                                            <div>
                                                <p className="font-bold text-zinc-900">{item.productName}</p>
                                                <p className="text-zinc-500 font-medium">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold">${item.total.toFixed(2)}</p>
                                        </div>
                                    ))}
                                    <Separator className="bg-zinc-100" />
                                    <div className="flex justify-between pt-2">
                                        <p className="text-sm font-black uppercase tracking-widest">Total</p>
                                        <p className="font-black text-lg">${order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-widest mb-6">Shipping Address</h3>
                                <div className="text-sm space-y-2">
                                    <p className="font-bold text-zinc-900">{order.shippingAddress.fullName}</p>
                                    <p className="text-zinc-500 font-medium leading-relaxed">
                                        {order.shippingAddress.addressLine1}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.zipCode}<br />
                                        {order.shippingAddress.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
