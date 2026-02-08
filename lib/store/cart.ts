'use client';

import { Cart, CartItem, CartItemWithProduct } from '../types';
import { getProductById } from '../utils/product';
import { supabase } from '@/lib/supabase/client';

const CART_STORAGE_KEY = 'teklito-cart';

// Helper to get current user
async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
}

// Sync local cart item to DB
async function syncItemToDB(item: CartItem, userId: string) {
    // Check if item exists
    const { data: existing } = await supabase
        .from('cart_items')
        .select('id')
        .eq('profile_id', userId)
        .eq('product_id', item.productId)
        .eq('selected_variants', JSON.stringify(item.selectedVariants)) // Strict match on variants
        .single();

    if (existing) {
        await supabase
            .from('cart_items')
            .update({ quantity: item.quantity })
            .eq('id', existing.id);
    } else {
        await supabase
            .from('cart_items')
            .insert({
                profile_id: userId,
                product_id: item.productId,
                quantity: item.quantity,
                selected_variants: item.selectedVariants
            });
    }
}

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

        // Sync to DB
        getCurrentUser().then(user => {
            if (user) {
                const item = cart.items[itemIndex]; // This might be stale if we spliced, but...
                // Wait, if we spliced (quantity <= 0), we removed it.
                // Re-find in modified cart? No, it's gone.
                // If it was removed locally, we need to remove from DB.
                // But removeFromCart logic above handles removal?
                // The splice happens here locally.

                if (quantity <= 0) {
                    // Reuse remove logic
                    // We can't call removeFromCart because it recurses/modifies local storage again? 
                    // No, removeFromCart is exported.
                    // But here we already modified 'cart'.
                    // Let's just do the DB delete logic.

                    // ... DB Delete Logic (same as removeFromCart)
                    syncDBRemove(productId, selectedVariants, user.id);
                } else {
                    // Update
                    const updatedItem = cart.items[itemIndex];
                    syncItemToDB(updatedItem, user.id);
                }
            }
        });
    }
}

async function syncDBRemove(productId: string, selectedVariants: Record<string, string> | undefined, userId: string) {
    const { data: items } = await supabase
        .from('cart_items')
        .select('id, selected_variants')
        .eq('profile_id', userId)
        .eq('product_id', productId);

    if (items) {
        const itemToDelete = items.find(i =>
            JSON.stringify(i.selected_variants) === JSON.stringify(selectedVariants)
        );
        if (itemToDelete) {
            await supabase.from('cart_items').delete().eq('id', itemToDelete.id);
        }
    }
}

export function clearCart(): void {
    saveCart({ items: [], updatedAt: new Date().toISOString() });

    getCurrentUser().then(async user => {
        if (user) {
            await supabase.from('cart_items').delete().eq('profile_id', user.id);
        }
    });
}

// Function to merge DB cart into local cart on login
export async function mergeDBCartToLocal() {
    const user = await getCurrentUser();
    if (!user) return;

    // Fetch DB items
    const { data: dbItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('profile_id', user.id);

    if (!dbItems || dbItems.length === 0) return;

    const cart = getCart();
    // Simple strategy: DB overwrites local or merges?
    // Let's merge: Add DB items to local if not present, take max quantity if present.
    // Or simpler: Trust DB as master if it has data? 
    // Usually, if I add to cart as guest, then login, I expect guest items to move to account.
    // So: Push local items to DB, then fetch full DB cart and save to local.

    // 1. Push local items to DB
    for (const item of cart.items) {
        await syncItemToDB(item, user.id);
    }

    // 2. Fetch updated DB cart
    const { data: updatedDbItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('profile_id', user.id);

    if (updatedDbItems) {
        const newItems: CartItem[] = updatedDbItems.map(i => ({
            productId: i.product_id,
            quantity: i.quantity,
            selectedVariants: i.selected_variants
        }));

        saveCart({
            items: newItems,
            updatedAt: new Date().toISOString()
        });
    }
}

export async function getCartItemsWithProducts(): Promise<CartItemWithProduct[]> {
    const cart = getCart();

    const itemsWithProducts = await Promise.all(
        cart.items.map(async (item) => {
            const product = await getProductById(item.productId);
            if (!product) return null;

            return {
                ...item,
                product,
            };
        })
    );

    return itemsWithProducts.filter((item): item is CartItemWithProduct => item !== null);
}

export async function getCartTotal(): Promise<number> {
    const items = await getCartItemsWithProducts();

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
