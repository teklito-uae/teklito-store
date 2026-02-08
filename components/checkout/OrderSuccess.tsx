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
        // Fetch success animation from CDN - using a more stable path
        fetch('https://assets9.lottiefiles.com/packages/lf20_ghp8y8db.json')
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Lottie fetch error:', err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 md:py-12">
            {/* Tick Animation */}
            <div className="w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 flex items-center justify-center">
                {animationData ? (
                    <Lottie
                        animationData={animationData}
                        loop={false}
                        className="w-full h-full"
                    />
                ) : (
                    <div className="w-20 h-20 bg-primary/20 rounded-full animate-pulse flex items-center justify-center">
                        <Package className="w-10 h-10 text-primary opacity-50" />
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
                <p className="text-[10px] md:text-xs text-zinc-500 font-medium max-w-[280px] md:max-w-none mx-auto opacity-80 uppercase tracking-widest">Your tech gear is on its way.</p>
            </motion.div>

            {/* Receipt Card */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", damping: 25 }}
                className="w-full max-w-sm md:max-w-md bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-100 flex flex-col"
            >
                {/* Header with cutouts */}
                <div className="bg-black p-6 md:p-8 text-white relative">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-1">Receipt</p>
                            <h2 className="text-lg md:text-xl font-bold">Teklito Store</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase">Order ID</p>
                            <p className="text-xs md:text-sm font-mono font-bold text-white uppercase">{orderNumber}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-zinc-400">
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

                    {/* Receipt Cutouts Left/Right */}
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-zinc-50 rounded-full" />
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-zinc-50 rounded-full" />
                </div>

                {/* Items Section */}
                <div className="p-6 md:p-8 bg-white border-b border-dashed border-zinc-200">
                    <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-zinc-50 flex-shrink-0 overflow-hidden border border-zinc-100 p-1 flex items-center justify-center">
                                    <ProductImage
                                        src={getImageUrl(item.product.images)}
                                        alt={item.product.name}
                                        className="h-full w-full object-contain"
                                        width={56}
                                        height={56}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col min-w-0">
                                    <span className="text-[11px] md:text-xs font-bold text-black truncate leading-tight">
                                        {item.product.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-medium font-poppins">
                                        Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                                    </span>
                                </div>
                                <span className="font-bold text-black text-xs md:text-sm font-poppins">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-50">
                        <div className="bg-zinc-50/50 rounded-xl p-3 md:p-4 mb-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Ship to</p>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-black">{shippingInfo.fullName}</p>
                                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                                    {shippingInfo.address}, {shippingInfo.city}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between text-[11px] md:text-xs text-zinc-500 pr-1">
                            <span>Subtotal</span>
                            <span className="font-bold text-black">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] md:text-xs text-zinc-500 pr-1">
                            <span>Shipping</span>
                            <span className="font-bold text-black">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                        </div>
                    </div>
                </div>

                {/* Total Section */}
                <div className="p-6 md:p-8 bg-zinc-50 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Amount</p>
                        <p className="text-xl md:text-2xl font-black text-black">${finalTotal.toFixed(2)}</p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-zinc-200 flex items-center justify-center bg-white shadow-sm">
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-black rotate-[315deg]" />
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
                    className="flex-1 h-14 rounded-[1.25rem] bg-black text-primary hover:bg-zinc-900 font-black uppercase tracking-wider text-xs shadow-xl shadow-black/10 group"
                >
                    <Link href="/products" className="flex items-center justify-center gap-2">
                        Let's shop again! 🛍️
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-14 rounded-[1.25rem] border-2 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 font-black uppercase tracking-wider text-xs transition-all group"
                >
                    <Link href="/products?category=gifts" className="flex items-center justify-center gap-2">
                        Let's gift someone 🎁
                    </Link>
                </Button>
            </motion.div>
        </div>
    );
}
