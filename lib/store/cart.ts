'use client';

import { Cart, CartItem, CartItemWithProduct } from '../types';
import { getProductById } from '../data/products';

const CART_STORAGE_KEY = 'teklito-cart';

// TODO: Replace localStorage with API calls to /api/cart
// Expected endpoints:
// - GET /api/cart - Get user's cart
// - POST /api/cart/add - Add item to cart
// - PUT /api/cart/update - Update item quantity
// - DELETE /api/cart/remove - Remove item from cart
// - DELETE /api/cart/clear - Clear entire cart

export function getCart(): Cart {
    if (typeof window === 'undefined') {
        return { items: [], updatedAt: new Date().toISOString() };
    }

    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) {
            return { items: [], updatedAt: new Date().toISOString() };
        }
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        return { items: [], updatedAt: new Date().toISOString() };
    }
}

export function saveCart(cart: Cart): void {
    if (typeof window === 'undefined') return;

    try {
        cart.updatedAt = new Date().toISOString();
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

        // Dispatch custom event for cart updates
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

export function addToCart(
    productId: string,
    quantity: number = 1,
    selectedVariants?: Record<string, string>
): void {
    const cart = getCart();

    // Check if item with same variants already exists
    const existingItemIndex = cart.items.findIndex(
        (item) =>
            item.productId === productId &&
            JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
    );

    if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({
            productId,
            quantity,
            selectedVariants,
        });
    }

    saveCart(cart);
}

export function removeFromCart(productId: string, selectedVariants?: Record<string, string>): void {
    const cart = getCart();

    cart.items = cart.items.filter(
        (item) =>
            !(
                item.productId === productId &&
                JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
            )
    );

    saveCart(cart);
}

export function updateQuantity(
    productId: string,
    quantity: number,
    selectedVariants?: Record<string, string>
): void {
    const cart = getCart();

    const itemIndex = cart.items.findIndex(
        (item) =>
            item.productId === productId &&
            JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
    );

    if (itemIndex > -1) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }
        saveCart(cart);
    }
}

export function clearCart(): void {
    saveCart({ items: [], updatedAt: new Date().toISOString() });
}

export function getCartItemsWithProducts(): CartItemWithProduct[] {
    const cart = getCart();

    return cart.items
        .map((item) => {
            const product = getProductById(item.productId);
            if (!product) return null;

            return {
                ...item,
                product,
            };
        })
        .filter((item): item is CartItemWithProduct => item !== null);
}

export function getCartTotal(): number {
    const items = getCartItemsWithProducts();

    return items.reduce((total, item) => {
        let price = item.product.price;

        // Apply variant price modifiers
        if (item.selectedVariants && item.product.variants) {
            item.product.variants.forEach((variant) => {
                const selectedValue = item.selectedVariants?.[variant.type];
                if (selectedValue) {
                    const option = variant.options.find((opt) => opt.value === selectedValue);
                    if (option?.priceModifier) {
                        price += option.priceModifier;
                    }
                }
            });
        }

        return total + price * item.quantity;
    }, 0);
}

export function getCartItemCount(): number {
    const cart = getCart();
    return cart.items.reduce((count, item) => count + item.quantity, 0);
}

export function isInCart(productId: string, selectedVariants?: Record<string, string>): boolean {
    const cart = getCart();

    return cart.items.some(
        (item) =>
            item.productId === productId &&
            JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
    );
}
