'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Gift, ArrowRight, Package, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CartItemWithProduct } from '@/lib/types';
import ProductImage from '@/components/product/ProductImage';
import { getImageUrl } from '@/lib/utils/image';
import dynamic from 'next/dynamic';

// Dynamic import for Lottie to avoid hydration issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface OrderSuccessProps {
    orderId: string;
    orderNumber: string;
    items: CartItemWithProduct[];
    shippingInfo: {
        fullName: string;
        address: string;
        city: string;
    };
    total: number;
    shippingCost: number;
}

export default function OrderSuccess({ orderId, orderNumber, items, shippingInfo, total, shippingCost }: OrderSuccessProps) {
    const [animationData, setAnimationData] = useState<any>(null);
    const finalTotal = total + shippingCost;

    useEffect(() => {
        // Fetch success animation from CDN
        fetch('https://assets9.lottiefiles.com/packages/lf20_ghp8y8db.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Lottie fetch error:', err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 md:py-12 font-poppins bg-[#FAFAFA]">
            {/* Tick Animation */}
            <div className="w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 flex items-center justify-center">
                {animationData ? (
                    <Lottie
                        animationData={animationData}
                        loop={false}
                        className="w-full h-full"
                    />
                ) : (
                    <div className="w-20 h-20 bg-emerald-50 rounded-full animate-pulse flex items-center justify-center">
                        <Package className="w-10 h-10 text-emerald-500 opacity-50" />
                    </div>
                )}
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8 md:mb-10 px-2"
            >
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black mb-1">Order Confirmed!</h1>
                <p className="text-[10px] md:text-xs text-zinc-400 font-black uppercase tracking-[0.3em] max-w-[280px] md:max-w-none mx-auto opacity-80">Your tech gear is on its way</p>
            </motion.div>

            {/* Receipt Card - Standardized to 5px and Shadow-free */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", damping: 25 }}
                className="w-full max-w-sm md:max-w-md bg-white rounded-[5px] border border-zinc-100 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="bg-black p-6 md:p-8 text-white relative">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Electronic Receipt</p>
                            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Teklito Store</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest">Order Num</p>
                            <p className="text-xs md:text-sm font-black text-white uppercase tracking-tight">{orderNumber}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-zinc-400 font-bold">
                        <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            <span>{items.length} Items</span>
                        </div>
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[100px] md:max-w-[150px]">{shippingInfo.city || 'UAE'}</span>
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="p-6 md:p-8 bg-white border-b border-dashed border-zinc-100">
                    <div className="space-y-5 md:space-y-6 mb-8 md:mb-10">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-[5px] bg-zinc-50 flex-shrink-0 overflow-hidden border border-zinc-100 p-1 flex items-center justify-center">
                                    <ProductImage
                                        src={getImageUrl(item.product.images)}
                                        alt={item.product.name}
                                        className="h-full w-full object-contain"
                                        width={56}
                                        height={56}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col min-w-0">
                                    <span className="text-[11px] md:text-xs font-black text-black truncate leading-tight uppercase tracking-tight">
                                        {item.product.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">
                                        Qty: {item.quantity} × AED {item.product.price.toFixed(2)}
                                    </span>
                                </div>
                                <span className="font-black text-black text-xs md:text-sm tracking-tighter">
                                    AED {(item.product.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-6 border-t border-zinc-50">
                        <div className="bg-zinc-50/50 rounded-[5px] p-4 mb-6 border border-zinc-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Delivery Address</p>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-black uppercase tracking-tight">{shippingInfo.fullName}</p>
                                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                                    {shippingInfo.address}, {shippingInfo.city}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between text-[11px] md:text-xs text-zinc-400 font-black uppercase tracking-widest pr-1">
                            <span>Subtotal</span>
                            <span className="text-black">AED {total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] md:text-xs text-zinc-400 font-black uppercase tracking-widest pr-1">
                            <span>Shipping</span>
                            <span className="text-black">{shippingCost === 0 ? 'FREE' : `AED ${shippingCost.toFixed(2)}`}</span>
                        </div>
                    </div>
                </div>

                {/* Total Section */}
                <div className="p-6 md:p-8 bg-zinc-50 flex items-center justify-between border-t border-zinc-100">
                    <div>
                        <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Grand Total</p>
                        <p className="text-xl md:text-2xl font-black text-black tracking-tighter">AED {finalTotal.toFixed(2)}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full border border-zinc-200 flex items-center justify-center bg-white">
                        <ArrowRight className="w-5 h-5 text-black rotate-[315deg]" />
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-12 flex flex-col md:flex-row gap-4 w-full max-w-md"
            >
                <Button
                    asChild
                    className="flex-1 h-14 rounded-[5px] bg-black text-white hover:bg-zinc-800 font-black uppercase tracking-[0.2em] text-[10px] group transition-all active:scale-[0.98]"
                >
                    <Link href="/products" className="flex items-center justify-center gap-2">
                        Shop Collection
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-14 rounded-[5px] border border-zinc-200 hover:bg-zinc-50 font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-[0.98]"
                >
                    <Link href="/" className="flex items-center justify-center gap-2">
                        Back to Home
                    </Link>
                </Button>
            </motion.div>
        </div>
    );
}
