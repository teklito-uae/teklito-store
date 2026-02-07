'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { CartItemWithProduct } from '@/lib/types';
import { toast } from 'sonner';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadCart();

        const handleCartUpdate = () => {
            loadCart();
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    const loadCart = () => {
        setCartItems(getCartItemsWithProducts());
        setTotal(getCartTotal());
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
                <Button variant="ghost" onClick={handleClearCart} className="text-destructive">
                    Clear Cart
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => {
                        const itemPrice = item.product.price;
                        const itemTotal = itemPrice * item.quantity;

                        return (
                            <Card key={`${item.productId}-${JSON.stringify(item.selectedVariants)}`}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="relative w-24 h-24 flex-shrink-0 bg-muted rounded overflow-hidden"
                                        >
                                            <Image
                                                src={item.product.images[0] || '/images/placeholder.jpg'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/products/${item.product.slug}`}>
                                                <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                                                    {item.product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.product.category}
                                            </p>
                                            {item.selectedVariants && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {Object.entries(item.selectedVariants).map(([key, value]) => (
                                                        <span
                                                            key={key}
                                                            className="text-xs bg-muted px-2 py-1 rounded"
                                                        >
                                                            {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Quantity Controls - Mobile */}
                                            <div className="flex items-center gap-2 mt-3 md:hidden">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="font-medium w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Quantity Controls - Desktop */}
                                        <div className="hidden md:flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="font-medium w-12 text-center">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Price & Remove */}
                                        <div className="flex flex-col items-end justify-between">
                                            <div className="text-right">
                                                <p className="font-bold text-lg">${itemTotal.toFixed(2)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    ${itemPrice.toFixed(2)} each
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemove(item)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium">
                                        {total >= 50 ? 'FREE' : '$5.00'}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${(total + (total >= 50 ? 0 : 5)).toFixed(2)}</span>
                                </div>
                            </div>

                            {total < 50 && (
                                <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted rounded">
                                    Add ${(50 - total).toFixed(2)} more for free shipping!
                                </p>
                            )}

                            <Button className="w-full mb-3" size="lg" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>

                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
