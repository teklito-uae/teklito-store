'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronRight,
    CreditCard,
    Truck,
    ShieldCheck,
    Lock,
    Package,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Building2,
    Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getCartItemsWithProducts, getCartTotal, clearCart } from '@/lib/store/cart';
import { CartItemWithProduct } from '@/lib/types';
import { toast } from 'sonner';
import Image from 'next/image';

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        country: 'UAE',
    });

    useEffect(() => {
        const items = getCartItemsWithProducts();
        const cartTotal = getCartTotal();

        if (items.length === 0) {
            router.push('/cart');
            return;
        }

        setCartItems(items);
        setTotal(cartTotal);
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
            toast.error('Missing details', {
                description: 'Please complete the shipping information.'
            });
            return;
        }

        setIsProcessing(true);

        // Simulate order placement
        setTimeout(() => {
            clearCart();
            toast.success('Order Confirmed!', {
                description: 'Welcome to the future. Your order is being processed.',
            });
            router.push('/orders');
            setIsProcessing(false);
        }, 2000);
    };

    const shippingCost = total >= 50 ? 0 : 5;
    const finalTotal = total + shippingCost;

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Minimal Header */}
            <div className="border-b border-zinc-100 bg-zinc-50/50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/cart" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
                        <ArrowLeft className="h-3 w-3" />
                        Back to Cart
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        {['Shipping', 'Payment', 'Review'].map((step, i) => (
                            <div key={step} className="flex items-center gap-3">
                                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black ${i === 0 ? 'bg-black text-primary' : 'bg-zinc-200 text-zinc-500'}`}>
                                    {i + 1}
                                </span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-black' : 'text-zinc-400'}`}>
                                    {step}
                                </span>
                                {i < 2 && <div className="w-8 h-[1px] bg-zinc-200 mx-2" />}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Lock className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure SSL</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-16 xl:gap-24">
                    {/* LEFT COLUMN: Forms */}
                    <div className="flex-1 space-y-16">
                        {/* Section Header */}
                        <div className="space-y-4">
                            <h1 className="text-h1 font-bold text-black tracking-tight uppercase leading-tight">
                                Checkout <span className="text-primary italic">Process</span>
                            </h1>
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                                Complete your order and join the Teklito elite.
                            </p>
                        </div>

                        {/* Shipping Details Card */}
                        <div className="space-y-10 group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors duration-500">
                                    <Truck className="h-5 w-5 text-primary group-hover:text-black transition-colors duration-500" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight text-black">Shipping Information</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 bg-zinc-50/50 p-8 md:p-12 rounded-[2.5rem] border border-zinc-100">
                                <div className="space-y-3 col-span-2 md:col-span-1">
                                    <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Receiver Name</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            value={shippingInfo.fullName}
                                            onChange={handleInputChange}
                                            className="h-14 pl-12 bg-white border-none rounded-xl shadow-sm focus-visible:ring-primary font-bold placeholder:text-zinc-200"
                                            placeholder="e.g. John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 col-span-2 md:col-span-1">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Contact</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={shippingInfo.email}
                                            onChange={handleInputChange}
                                            className="h-14 pl-12 bg-white border-none rounded-xl shadow-sm focus-visible:ring-primary font-bold placeholder:text-zinc-200"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 col-span-2">
                                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mobile Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={shippingInfo.phone}
                                            onChange={handleInputChange}
                                            className="h-14 pl-12 bg-white border-none rounded-xl shadow-sm focus-visible:ring-primary font-bold placeholder:text-zinc-200"
                                            placeholder="+971 50 123 4567"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 col-span-2">
                                    <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Delivery Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                        <Input
                                            id="address"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleInputChange}
                                            className="h-14 pl-12 bg-white border-none rounded-xl shadow-sm focus-visible:ring-primary font-bold placeholder:text-zinc-200"
                                            placeholder="Street, Building, Apartment No."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">City</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                        <Input
                                            id="city"
                                            name="city"
                                            value={shippingInfo.city}
                                            onChange={handleInputChange}
                                            className="h-14 pl-12 bg-white border-none rounded-xl shadow-sm focus-visible:ring-primary font-bold placeholder:text-zinc-200"
                                            placeholder="Dubai"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="zipCode" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ZIP / Postcode</Label>
                                    <Input
                                        id="zipCode"
                                        name="zipCode"
                                        value={shippingInfo.zipCode}
                                        onChange={handleInputChange}
                                        className="h-14 px-6 bg-white border-none rounded-xl shadow-sm focus-visible:ring-primary font-bold placeholder:text-zinc-200"
                                        placeholder="00000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="space-y-10 group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors duration-500">
                                    <CreditCard className="h-5 w-5 text-primary group-hover:text-black transition-colors duration-500" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight text-black">Payment Confirmation</h2>
                            </div>

                            <div className="bg-zinc-50/50 p-8 rounded-[2.5rem] border border-zinc-100">
                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <div className="space-y-4">
                                        <div className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-white bg-white hover:border-zinc-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-zinc-200'}`}>
                                                    {paymentMethod === 'cod' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                                </div>
                                                <RadioGroupItem value="cod" id="cod" className="sr-only" />
                                                <Label htmlFor="cod" className="cursor-pointer space-y-1">
                                                    <div className="font-black uppercase tracking-widest text-xs">Cash on Delivery</div>
                                                    <p className="text-[10px] font-bold text-zinc-400">Settlement at point of reception</p>
                                                </Label>
                                            </div>
                                            <Package className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-primary' : 'text-zinc-200'}`} />
                                        </div>

                                        <div className="p-6 rounded-3xl border-2 border-dashed border-zinc-200 opacity-50 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-6 w-6 rounded-full border-2 border-zinc-100" />
                                                <div className="space-y-1">
                                                    <div className="font-black uppercase tracking-widest text-xs text-zinc-400">Digital Transaction</div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Protocol restricted • Coming Soon</p>
                                                </div>
                                            </div>
                                            <Lock className="h-6 w-6 text-zinc-200" />
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="lg:sticky lg:top-12 space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] text-black border border-zinc-100 shadow-xl shadow-zinc-200/50">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Order <span className="text-primary NOT-italic">Summary</span></h3>
                                <div className="h-1 w-12 bg-primary rounded-full" />
                            </div>

                            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide py-2">
                                {cartItems.map((item: CartItemWithProduct, idx: number) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="relative w-20 h-20 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100 p-2">
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-contain transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 truncate">{item.product.name}</p>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {Object.entries(item.selectedVariants || {}).map(([key, val]) => (
                                                    <span key={key} className="text-[8px] font-black bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-500 uppercase tracking-tighter">{val as string}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-sm font-black whitespace-nowrap text-zinc-900">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-zinc-100">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    <span>Sub-Registry Total</span>
                                    <span className="text-black">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    <span>Logistics Fee</span>
                                    <span className={shippingCost === 0 ? 'text-primary font-black' : 'text-black'}>
                                        {shippingCost === 0 ? 'PROTOCOL FREE' : `$${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="pt-6 border-t border-zinc-100 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Final Settlement</div>
                                        <div className="text-4xl font-black tracking-tighter leading-none text-black">${finalTotal.toFixed(2)}</div>
                                    </div>
                                    <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest text-right">VAT included • Final price</div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full h-16 bg-primary hover:bg-black text-black hover:text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 transform active:scale-[0.98] mt-6 shadow-[0_10px_30px_rgba(199,245,2,0.3)] shadow-primary/20 group"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        <span>Syncing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Confirm Access</span>
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </Button>

                            {/* Trust Features below CTA */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100 group hover:border-primary/30 transition-colors">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Encrypted</span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100 group hover:border-primary/30 transition-colors">
                                    <Truck className="h-4 w-4 text-primary" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Tracked</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
