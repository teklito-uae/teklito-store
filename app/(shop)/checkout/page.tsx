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
import { getCartItemsWithProducts, getCartSubtotal, getCartShippingFee, clearCart } from '@/lib/store/cart';
import { CartItemWithProduct } from '@/lib/types';
import { toast } from 'sonner';
import ProductImage from '@/components/product/ProductImage';
import { createOrder } from '@/lib/actions/orders';
import OrderSuccess from '@/components/checkout/OrderSuccess';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
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

            if (items.length === 0) {
                router.push('/cart');
                return;
            }

            const currentSubtotal = await getCartSubtotal();
            const currentShipping = await getCartShippingFee(currentSubtotal);

            setSubtotal(currentSubtotal);
            setShippingCost(currentShipping);
            setCartItems(items);
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

    const total = subtotal + shippingCost;

    if (isSuccess) {
        return (
            <OrderSuccess
                orderId={orderId}
                orderNumber={finalOrderNumber}
                items={cartItems}
                shippingInfo={shippingInfo}
                total={subtotal}
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
                    <div className="w-16 h-16 bg-black rounded-[5px] flex items-center justify-center border border-primary/20">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Verifying Identity</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20 font-poppins relative">
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
                            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black mb-2">
                                {currentStep === 1 && 'Shipping Details'}
                                {currentStep === 2 && 'Payment Method'}
                                {currentStep === 3 && 'Review Order'}
                            </h1>
                        </div>

                        {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white p-6 md:p-8 rounded-[5px] border border-zinc-100">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                value={shippingInfo.fullName}
                                                onChange={handleInputChange}
                                                className="h-12 rounded-[5px] border-zinc-100 focus:ring-black focus:border-black text-sm font-medium"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={shippingInfo.email}
                                                onChange={handleInputChange}
                                                className="h-12 rounded-[5px] border-zinc-100 focus:ring-black focus:border-black text-sm font-medium"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={shippingInfo.phone}
                                                onChange={handleInputChange}
                                                className="h-12 rounded-[5px] border-zinc-100 focus:ring-black focus:border-black text-sm font-medium"
                                                placeholder="+971 50 000 0000"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Delivery Address</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={shippingInfo.address}
                                                onChange={handleInputChange}
                                                className="h-12 rounded-[5px] border-zinc-100 focus:ring-black focus:border-black text-sm font-medium"
                                                placeholder="Street, Building, Apartment No."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={shippingInfo.city}
                                                onChange={handleInputChange}
                                                className="h-12 rounded-[5px] border-zinc-100 focus:ring-black focus:border-black text-sm font-medium"
                                                placeholder="Dubai"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">ZIP / Postcode</Label>
                                            <Input
                                                id="zipCode"
                                                name="zipCode"
                                                value={shippingInfo.zipCode}
                                                onChange={handleInputChange}
                                                className="h-12 rounded-[5px] border-zinc-100 focus:ring-black focus:border-black text-sm font-medium"
                                                placeholder="00000"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={nextStep} className="h-14 w-full md:w-auto px-10 bg-black text-white hover:bg-zinc-800 transition-all rounded-[5px] text-[10px] font-black uppercase tracking-[0.2em]">
                                        Continue to Payment
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white p-6 md:p-8 rounded-[5px] border border-zinc-100">
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                                        <div className={`relative flex items-center space-x-4 rounded-[5px] border p-5 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}>
                                            <RadioGroupItem value="cod" id="cod" className="border-zinc-300" />
                                            <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-black uppercase tracking-tight">Cash on Delivery</span>
                                                    <Package className="h-5 w-5 text-zinc-400" />
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex flex-col-reverse md:flex-row justify-between gap-4 pt-4">
                                    <Button variant="outline" onClick={prevStep} className="h-14 px-10 rounded-[5px] border-zinc-100 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50">
                                        Back
                                    </Button>
                                    <Button onClick={nextStep} className="h-14 w-full md:w-auto px-10 bg-black text-white hover:bg-zinc-800 transition-all rounded-[5px] text-[10px] font-black uppercase tracking-[0.2em]">
                                        Review Order
                                    </Button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Mobile Items List - First on Mobile */}
                                <div className="lg:hidden space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Review Items</h3>
                                        <span className="text-[10px] font-bold text-zinc-900">{cartItems.length} Products</span>
                                    </div>
                                    <div className="space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={item.productId} className="flex gap-4 bg-white p-4 rounded-[5px] border border-zinc-100">
                                                <div className="relative w-16 h-16 bg-zinc-50 rounded-[5px] overflow-hidden border border-zinc-100 shrink-0">
                                                    <ProductImage src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                    <p className="text-[11px] font-bold text-zinc-900 line-clamp-2 leading-tight uppercase tracking-tight">{item.product.name}</p>
                                                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-[11px] font-black text-black self-center">
                                                    AED {(item.product.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white p-6 md:p-8 rounded-[5px] border border-zinc-100 space-y-6">
                                    <div className="bg-zinc-50/50 p-6 rounded-[5px] border border-zinc-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Shipping To</h3>
                                            <button onClick={() => setCurrentStep(1)} className="text-[10px] font-black uppercase tracking-widest text-black hover:underline underline-offset-4 transition-all">Edit</button>
                                        </div>
                                        <p className="text-sm font-bold text-black uppercase tracking-tight mb-1">{shippingInfo.fullName}</p>
                                        <p className="text-xs text-zinc-600 font-medium leading-relaxed">{shippingInfo.address}, {shippingInfo.city}</p>
                                        <p className="text-xs text-zinc-600 font-medium mt-1">{shippingInfo.phone}</p>
                                    </div>

                                    <div className="bg-zinc-50/50 p-6 rounded-[5px] border border-zinc-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Method</h3>
                                            <button onClick={() => setCurrentStep(2)} className="text-[10px] font-black uppercase tracking-widest text-black hover:underline underline-offset-4 transition-all">Edit</button>
                                        </div>
                                        <p className="text-sm font-bold text-black uppercase tracking-tight">Cash on Delivery</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between gap-4 pt-4">
                                    <Button variant="outline" onClick={prevStep} className="h-14 px-10 rounded-[5px] border-zinc-100 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50">
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                        className="h-14 w-full md:w-auto px-12 bg-black text-white hover:bg-zinc-800 transition-all rounded-[5px] text-[10px] font-black uppercase tracking-[0.2em]"
                                    >
                                        {isProcessing ? 'Processing...' : 'Place Order'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="sticky top-24 bg-white p-6 md:p-8 rounded-[5px] border border-zinc-100">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-8">Your Order</h2>

                            <div className={cn(
                                "space-y-6 max-h-[45vh] overflow-y-auto scrollbar-hide mb-8 pr-1",
                                currentStep === 3 && "hidden lg:block"
                            )}>
                                {cartItems.map((item) => (
                                    <div key={item.productId} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-zinc-50 rounded-[5px] overflow-hidden border border-zinc-100 flex-shrink-0">
                                            <ProductImage
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <p className="text-[11px] font-bold text-zinc-900 line-clamp-2 leading-tight uppercase tracking-tight">{item.product.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-[11px] font-black text-zinc-900 flex items-center">
                                            AED {(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-zinc-100 pt-6 mt-6">
                                <div className="flex justify-between text-xs font-poppins">
                                    <span className="text-zinc-500 font-medium">Subtotal</span>
                                    <span className="font-bold text-black">AED {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-poppins">
                                    <span className="text-zinc-500 font-medium">Shipping</span>
                                    <span className="font-bold text-black uppercase tracking-widest text-[10px]">
                                        {shippingCost === 0 ? 'Free' : `AED ${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline pt-4 border-t border-zinc-100 mt-4">
                                    <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Total</span>
                                    <span className="text-2xl font-black text-zinc-900 tracking-tighter">AED {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-3 p-4 bg-zinc-50 rounded-[5px] border border-zinc-100">
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-zinc-200">
                                    <Lock className="h-4 w-4 text-emerald-500" />
                                </div>
                                <p className="text-[10px] text-zinc-500 font-medium leading-tight">
                                    Safe and secure. Your payments are processed with military-grade encryption.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
