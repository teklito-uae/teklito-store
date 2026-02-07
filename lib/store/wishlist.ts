'use client';

import { Wishlist } from '../types';

const WISHLIST_STORAGE_KEY = 'teklito-wishlist';

// TODO: Replace localStorage with API calls to /api/wishlist
// Expected endpoints:
// - GET /api/wishlist - Get user's wishlist
// - POST /api/wishlist/add - Add product to wishlist
// - DELETE /api/wishlist/remove - Remove product from wishlist
// - DELETE /api/wishlist/clear - Clear entire wishlist

export function getWishlist(): Wishlist {
    if (typeof window === 'undefined') {
        return { productIds: [], updatedAt: new Date().toISOString() };
    }

    try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (!stored) {
            return { productIds: [], updatedAt: new Date().toISOString() };
        }
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error reading wishlist from localStorage:', error);
        return { productIds: [], updatedAt: new Date().toISOString() };
    }
}

export function saveWishlist(wishlist: Wishlist): void {
    if (typeof window === 'undefined') return;

    try {
        wishlist.updatedAt = new Date().toISOString();
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));

        // Dispatch custom event for wishlist updates
        window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: wishlist }));
    } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
    }
}

export function addToWishlist(productId: string): void {
    const wishlist = getWishlist();

    if (!wishlist.productIds.includes(productId)) {
        wishlist.productIds.push(productId);
        saveWishlist(wishlist);
    }
}

export function removeFromWishlist(productId: string): void {
    const wishlist = getWishlist();

    wishlist.productIds = wishlist.productIds.filter((id) => id !== productId);
    saveWishlist(wishlist);
}

export function toggleWishlist(productId: string): boolean {
    const wishlist = getWishlist();
    const isInWishlist = wishlist.productIds.includes(productId);

    if (isInWishlist) {
        removeFromWishlist(productId);
        return false;
    } else {
        addToWishlist(productId);
        return true;
    }
}

export function clearWishlist(): void {
    saveWishlist({ productIds: [], updatedAt: new Date().toISOString() });
}

export function isInWishlist(productId: string): boolean {
    const wishlist = getWishlist();
    return wishlist.productIds.includes(productId);
}

export function getWishlistCount(): number {
    const wishlist = getWishlist();
    return wishlist.productIds.length;
}
