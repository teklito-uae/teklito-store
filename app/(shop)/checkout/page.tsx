'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    ShieldCheck,
    Lock,
    Package,
    ArrowLeft,
    ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getCartItemsWithProducts, getCartTotal, clearCart } from '@/lib/store/cart';
import { CartItemWithProduct } from '@/lib/types';
import { toast } from 'sonner';
import ProductImage from '@/components/product/ProductImage';
import { createOrder } from '@/lib/actions/orders';
import OrderSuccess from '@/components/checkout/OrderSuccess';

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
    const [tempOrderNumber, setTempOrderNumber] = useState('');
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        country: 'UAE',
    });

    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [finalOrderNumber, setFinalOrderNumber] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const items = await getCartItemsWithProducts();
            const cartTotal = await getCartTotal();

            if (items.length === 0) {
                router.push('/cart');
                return;
            }

            setCartItems(items);
            setTotal(cartTotal);
            setIsSessionLoading(false);
        };

        loadData();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
                toast.error('Missing details', {
                    description: 'Please complete the shipping information.'
                });
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            setCurrentStep(3);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePlaceOrder = async () => {
        const orderNum = `TK-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        setTempOrderNumber(orderNum);
        setIsProcessing(true);

        try {
            const result = await createOrder({
                shippingInfo,
                paymentMethod,
                items: cartItems,
            });

            if (result.success) {
                setOrderId(result.orderId || '');
                setFinalOrderNumber(result.orderNumber || orderNum);
                setIsSuccess(true);
                clearCart();
            } else {
                toast.error('Order Failed', {
                    description: result.error || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const shippingCost = total >= 50 ? 0 : 5;
    const finalTotal = total + shippingCost;

    if (isSuccess) {
        return (
            <OrderSuccess
                orderId={orderId}
                orderNumber={finalOrderNumber}
                items={cartItems}
                shippingInfo={shippingInfo}
                total={total}
                shippingCost={shippingCost}
            />
        );
    }

    if (isSessionLoading) {
        return (
            <div className="bg-zinc-50/30 min-h-screen flex flex-col items-center justify-center p-4">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-primary/20">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Verifying Identity</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50/30 min-h-screen pb-20 font-sans relative">
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-primary/40"
                        >
                            <Package className="w-10 h-10 text-black" />
                        </motion.div>

                        <div className="space-y-1 mb-6">
                            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">Processing Order</h2>
                            <p className="text-primary font-mono text-xs md:text-sm tracking-widest font-black">{tempOrderNumber}</p>
                        </div>

                        <p className="text-zinc-500 text-xs md:text-sm font-medium max-w-xs">Generating your high-tech receipt and securing stock across our warehouses.</p>

                        <div className="mt-12 w-64 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full h-full bg-primary"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="border-b border-zinc-100 bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/cart" className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-black transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Cart
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {['Shipping', 'Payment', 'Review'].map((step, i) => {
                            const stepNum = i + 1;
                            const isActive = stepNum === currentStep;
                            const isCompleted = stepNum < currentStep;

                            return (
                                <div key={step} className="flex items-center gap-3">
                                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                                        ${isActive ? 'bg-black text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                        {isCompleted ? <ShieldCheck className="h-3 w-3" /> : stepNum}
                                    </span>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors
                                        ${isActive ? 'text-black' : 'text-zinc-400'}`}>
                                        {step}
                                    </span>
                                    {i < 2 && <div className={`w-8 h-[1px] mx-2 transition-colors ${stepNum < currentStep ? 'bg-green-500' : 'bg-zinc-100'}`} />}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400">
                        <Lock className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Secure</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-black tracking-tight mb-2">
                                {currentStep === 1 && 'Shipping Details'}
                                {currentStep === 2 && 'Payment Method'}
                                {currentStep === 3 && 'Review Order'}
                            </h1>
                        </div>

                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white p-6 md:p-8 rounded-[5px] border border-zinc-200 shadow-sm">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-xs font-bold text-zinc-700">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                value={shippingInfo.fullName}
                                                onChange={handleInputChange}
                                                className="h-10 rounded-[5px] border-zinc-200 focus:ring-black focus:border-black text-sm"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold text-zinc-700">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={shippingInfo.email}
                                                onChange={handleInputChange}
                                                className="h-10 rounded-[5px] border-zinc-200 focus:ring-black focus:border-black text-sm"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs font-bold text-zinc-700">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={shippingInfo.phone}
                                                onChange={handleInputChange}
                                                className="h-10 rounded-[5px] border-zinc-200 focus:ring-black focus:border-black text-sm"
                                                placeholder="+971 50 000 0000"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="address" className="text-xs font-bold text-zinc-700">Delivery Address</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={shippingInfo.address}
                                                onChange={handleInputChange}
                                                className="h-10 rounded-[5px] border-zinc-200 focus:ring-black focus:border-black text-sm"
                                                placeholder="Street, Building, Apartment No."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-xs font-bold text-zinc-700">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={shippingInfo.city}
                                                onChange={handleInputChange}
                                                className="h-10 rounded-[5px] border-zinc-200 focus:ring-black focus:border-black text-sm"
                                                placeholder="Dubai"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode" className="text-xs font-bold text-zinc-700">ZIP / Postcode</Label>
                                            <Input
                                                id="zipCode"
                                                name="zipCode"
                                                value={shippingInfo.zipCode}
                                                onChange={handleInputChange}
                                                className="h-10 rounded-[5px] border-zinc-200 focus:ring-black focus:border-black text-sm"
                                                placeholder="00000"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={nextStep} className="h-12 w-full md:w-auto px-8 bg-black text-primary hover:bg-zinc-900 hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-[5px] text-xs font-black uppercase tracking-wider">
                                        Continue to Payment
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white p-6 md:p-8 rounded-[5px] border border-zinc-200 shadow-sm">
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                        <div className={`relative flex items-center space-x-4 rounded-[5px] border p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                                            <RadioGroupItem value="cod" id="cod" />
                                            <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-black">Cash on Delivery</span>
                                                    <Package className="h-5 w-5 text-zinc-500" />
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-[5px] border-zinc-200 text-xs font-bold uppercase tracking-wider hover:bg-zinc-50">
                                        Back
                                    </Button>
                                    <Button onClick={nextStep} className="h-12 w-full md:w-auto px-8 bg-black text-primary hover:bg-zinc-900 hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-[5px] text-xs font-black uppercase tracking-wider">
                                        Review Order
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white p-6 md:p-8 rounded-[5px] border border-zinc-200 shadow-sm space-y-6">
                                    <div className="bg-zinc-50 p-4 rounded-[5px]">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Shipping To</h3>
                                            <button onClick={() => setCurrentStep(1)} className="text-[10px] font-bold text-blue-600 hover:underline">Edit</button>
                                        </div>
                                        <p className="text-sm font-bold text-black">{shippingInfo.fullName}</p>
                                        <p className="text-sm text-zinc-600">{shippingInfo.address}, {shippingInfo.city}</p>
                                        <p className="text-sm text-zinc-600">{shippingInfo.phone}</p>
                                    </div>

                                    <div className="bg-zinc-50 p-4 rounded-[5px]">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-500">Payment Method</h3>
                                            <button onClick={() => setCurrentStep(2)} className="text-[10px] font-bold text-blue-600 hover:underline">Edit</button>
                                        </div>
                                        <p className="text-sm font-bold text-black">Cash on Delivery</p>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-[5px] border-zinc-200 text-xs font-bold uppercase tracking-wider hover:bg-zinc-50">
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                        className="h-12 w-full md:w-auto px-12 bg-black text-primary hover:bg-zinc-900 hover:scale-[1.02] active:scale-95 transition-all duration-300 rounded-[5px] text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/10"
                                    >
                                        {isProcessing ? 'Processing...' : 'Place Order'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[380px] flex-shrink-0">
                        <div className="sticky top-24 bg-white p-6 rounded-[5px] border border-zinc-200 shadow-sm">
                            <h2 className="text-lg font-bold text-black mb-6">Order Summary</h2>

                            <div className="space-y-4 max-h-[40vh] overflow-y-auto scrollbar-hide mb-6 pr-1">
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="flex gap-3">
                                        <div className="relative w-16 h-16 bg-zinc-50 rounded-[5px] overflow-hidden border border-zinc-100 flex-shrink-0">
                                            <ProductImage
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-zinc-900 line-clamp-2 leading-tight">{item.product.name}</p>
                                            <p className="text-[10px] text-zinc-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-xs font-bold text-zinc-900">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-zinc-100 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Subtotal</span>
                                    <span className="font-bold text-black">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Shipping</span>
                                    <span className="font-bold text-black">
                                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline pt-2 border-t border-zinc-100 mt-2">
                                    <span className="text-base font-bold text-black">Total</span>
                                    <span className="text-2xl font-black text-black">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
