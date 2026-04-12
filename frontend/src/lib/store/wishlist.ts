import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  productIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addToWishlist: (productId) => {
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds
            : [...state.productIds, productId],
        }));
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
      },

      removeFromWishlist: (productId) => {
        set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) }));
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
      },

      toggleWishlist: (productId) => {
        const inList = get().productIds.includes(productId);
        if (inList) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },

      isInWishlist: (productId) => get().productIds.includes(productId),

      getCount: () => get().productIds.length,
    }),
    { name: 'teklito-wishlist' }
  )
);
