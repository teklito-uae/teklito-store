import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

export const SHIPPING_THRESHOLD = 200;
export const STANDARD_SHIPPING_FEE = 20;

interface CartState {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  getItemCount: () => number;
  isInCart: (productId: string, selectedVariants?: Record<string, string>) => boolean;
}

const variantKey = (v?: Record<string, string>) => JSON.stringify(v ?? {});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (productId, quantity = 1, selectedVariants) => {
        set((state) => {
          const existing = state.items.findIndex(
            (i) => i.productId === productId && variantKey(i.selectedVariants) === variantKey(selectedVariants)
          );
          if (existing > -1) {
            const items = [...state.items];
            items[existing] = { ...items[existing], quantity: items[existing].quantity + quantity };
            return { items };
          }
          return { items: [...state.items, { productId, quantity, selectedVariants }] };
        });
        window.dispatchEvent(new CustomEvent('cart-updated'));
      },

      removeFromCart: (productId, selectedVariants) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && variantKey(i.selectedVariants) === variantKey(selectedVariants))
          ),
        }));
        window.dispatchEvent(new CustomEvent('cart-updated'));
      },

      updateQuantity: (productId, quantity, selectedVariants) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => !(i.productId === productId && variantKey(i.selectedVariants) === variantKey(selectedVariants))
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId && variantKey(i.selectedVariants) === variantKey(selectedVariants)
                ? { ...i, quantity }
                : i
            ),
          };
        });
        window.dispatchEvent(new CustomEvent('cart-updated'));
      },

      clearCart: () => {
        set({ items: [] });
        window.dispatchEvent(new CustomEvent('cart-updated'));
      },

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      isInCart: (productId, selectedVariants) =>
        get().items.some(
          (i) => i.productId === productId && variantKey(i.selectedVariants) === variantKey(selectedVariants)
        ),
    }),
    { name: 'teklito-cart' }
  )
);
