'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductImage from '@/components/product/ProductImage';
import Loading from '@/components/shared/Loading';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    getCartItemsWithProducts,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartSubtotal,
    getCartShippingFee,
} from '@/lib/store/cart';
import { getProducts } from '@/lib/actions/products';
import ProductCarousel from '@/components/product/ProductCarousel';
import { CartItemWithProduct, Product } from '@/lib/types';
import { toast } from 'sonner';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    useEffect(() => {
        loadCart();
        loadRelatedProducts();

        const handleCartUpdate = () => {
            loadCart();
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    const loadRelatedProducts = async () => {
        const products = await getProducts();
        // Just take the first 10 as recommendations for now
        setRelatedProducts(products.slice(0, 10));
    };

    const loadCart = async () => {
        try {
            const items = await getCartItemsWithProducts();
            setCartItems(items);
            const currentSubtotal = await getCartSubtotal();
            setSubtotal(currentSubtotal);
            const currentShipping = await getCartShippingFee(currentSubtotal);
            setShippingFee(currentShipping);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = (item: CartItemWithProduct, newQuantity: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.product.stock) {
            toast.error('Not enough stock available');
            return;
        }
        updateQuantity(item.productId, newQuantity, item.selectedVariants);
    };

    const handleRemove = (item: CartItemWithProduct) => {
        removeFromCart(item.productId, item.selectedVariants);
        toast.info('Removed from cart');
    };

    const handleClearCart = () => {
        clearCart();
        toast.success('Cart cleared');
    };

    if (loading) {
        return <Loading />;
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">
                        Add some products to get started!
                    </p>
                    <Button asChild className="rounded-[5px]">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const total = subtotal + shippingFee;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen font-poppins">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">Shopping Cart</h1>
                <Button variant="ghost" onClick={handleClearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider rounded-[5px]">
                    Clear Cart
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => {
                        const itemPrice = item.product.price;

                        return (
                            <div key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`} className="group flex gap-4 md:gap-6 p-4 bg-white border border-zinc-100 rounded-[5px] hover:border-zinc-200 transition-colors">
                                {/* Product Image */}
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-zinc-50 rounded-[5px] overflow-hidden border border-zinc-100"
                                >
                                    <ProductImage
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <Link href={`/products/${item.product.slug}`}>
                                                <h3 className="font-bold text-sm md:text-base text-zinc-900 group-hover:text-primary transition-colors line-clamp-1">
                                                    {item.product.name}
                                                </h3>
                                            </Link>
                                            <p className="font-black text-sm md:text-base whitespace-nowrap">
                                                AED {itemPrice.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="text-xs text-zinc-500 font-medium mt-1">
                                            {item.product.category}
                                        </p>
                                        {item.selectedVariants && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {Object.entries(item.selectedVariants).map(([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="text-[10px] bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-zinc-600"
                                                    >
                                                        {value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center h-8 bg-zinc-50 rounded-[5px] border border-zinc-200/50 px-1 w-fit text-black">
                                            <button
                                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="h-6 w-6 flex items-center justify-center hover:bg-white rounded-[3px] transition-colors disabled:opacity-50"
                                            >
                                                <Minus className="h-3 w-3 text-zinc-600" />
                                            </button>
                                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock}
                                                className="h-6 w-6 flex items-center justify-center hover:bg-white rounded-[3px] transition-colors disabled:opacity-50"
                                            >
                                                <Plus className="h-3 w-3 text-zinc-600" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(item)}
                                            className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                                            title="Remove item"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-zinc-100 rounded-[5px] p-6 lg:p-8 sticky top-24">
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-medium font-poppins">Subtotal</span>
                                <span className="font-black text-black">AED {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-medium font-poppins">Shipping</span>
                                <span className="font-black text-black uppercase tracking-wider text-[11px]">
                                    {shippingFee === 0 ? 'Free' : `AED ${shippingFee.toFixed(2)}`}
                                </span>
                            </div>
                            <Separator className="bg-zinc-100" />
                            <div className="flex justify-between items-baseline pt-2">
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Total</span>
                                <span className="text-2xl font-black text-zinc-900 tracking-tighter">AED {total.toFixed(2)}</span>
                            </div>
                        </div>

                        {shippingFee > 0 && (
                            <div className="mb-8 p-4 bg-emerald-50/50 border border-emerald-100 rounded-[5px] text-center">
                                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                                    Add AED {(200 - subtotal).toFixed(2)} more for free shipping!
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <Button className="w-full h-14 bg-black hover:bg-zinc-800 text-white rounded-[5px] font-black uppercase tracking-widest text-[10px] transition-all active:scale-[0.98]" asChild>
                                <Link href="/checkout">Checkout Now</Link>
                            </Button>

                            <Button variant="outline" className="w-full h-14 rounded-[5px] font-black uppercase tracking-widest text-[10px] border-zinc-100 hover:bg-zinc-50 hover:text-black transition-all active:scale-[0.98]" asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Carousel */}
            {relatedProducts.length > 0 && (
                <div className="mt-32 border-t border-zinc-100 pt-16">
                    <ProductCarousel
                        title="You Might Also Like"
                        products={relatedProducts}
                        viewAllLink="/products"
                    />
                </div>
            )}
        </div>
    );
}
