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
    getCartTotal,
} from '@/lib/store/cart';
import { getProducts } from '@/lib/actions/products';
import ProductCarousel from '@/components/product/ProductCarousel';
import { CartItemWithProduct, Product } from '@/lib/types';
import { toast } from 'sonner';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [total, setTotal] = useState(0);
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
            const total = await getCartTotal();
            setTotal(total);
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
                    <Button asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">Shopping Cart</h1>
                <Button variant="ghost" onClick={handleClearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider">
                    Clear Cart
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => {
                        const itemPrice = item.product.price;
                        const itemTotal = itemPrice * item.quantity;

                        return (
                            <div key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`} className="group flex gap-4 md:gap-6 p-4 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-200 transition-colors">
                                {/* Product Image */}
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100"
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
                                                ${itemPrice.toFixed(2)}
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
                                        <div className="flex items-center h-8 bg-zinc-50 rounded-lg border border-zinc-200/50 px-1 w-fit">
                                            <button
                                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="h-6 w-6 flex items-center justify-center hover:bg-white rounded transition-colors disabled:opacity-50"
                                            >
                                                <Minus className="h-3 w-3 text-zinc-600" />
                                            </button>
                                            <span className="w-8 text-center text-xs font-bold text-zinc-900">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock}
                                                className="h-6 w-6 flex items-center justify-center hover:bg-white rounded transition-colors disabled:opacity-50"
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
                    <div className="bg-zinc-50/50 border border-zinc-100 rounded-[2rem] p-6 sticky top-24">
                        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Subtotal</span>
                                <span className="font-bold text-zinc-900">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Shipping</span>
                                <span className="font-bold text-zinc-900">
                                    {total >= 50 ? 'FREE' : '$5.00'}
                                </span>
                            </div>
                            <Separator className="bg-zinc-200/50" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-black uppercase tracking-widest text-zinc-900">Total</span>
                                <span className="text-xl font-black text-zinc-900">${(total + (total >= 50 ? 0 : 5)).toFixed(2)}</span>
                            </div>
                        </div>

                        {total < 50 && (
                            <div className="mb-6 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-center">
                                <p className="text-xs text-blue-600 font-bold">
                                    Add ${(50 - total).toFixed(2)} more for free shipping!
                                </p>
                            </div>
                        )}

                        <Button className="w-full h-12 bg-black hover:bg-zinc-800 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-black/5 mb-3" asChild>
                            <Link href="/checkout">Checkout Now</Link>
                        </Button>

                        <Button variant="outline" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs border-zinc-200 hover:bg-zinc-50 hover:text-black" asChild>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Related Products Carousel */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 border-t border-zinc-100 pt-16">
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
