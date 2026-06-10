import { create } from 'zustand';
import { CartItemType, CartResponseType, AddToCartRequest } from '../types/cart_types';
import { addToCart, clearCart, getCart, removeFromCart } from '../services/cart_api';


interface CartState {
    items: CartItemType[];
    cartTotal: string;
    cartCount: number;
    loading: boolean,
    error: string | null,

    fetchCart: () => Promise<void>;
    addItem: (data: AddToCartRequest) => Promise<void>;
    removeItem: (product_id: string, quantity: number) => Promise<void>;
    clearItems: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set) => ({
    items: [],
    cartTotal: "0",
    cartCount: 0,
    loading: false,
    error: null,

    fetchCart: async () => {
        try {
            const data = await getCart();

            set({
                items: data.items,
                cartCount: data.cart_count,
                cartTotal: data.cart_total
            })
        } catch (error) {
            console.error("fetchCart failed:", error);
        }
    },

    addItem: async (data: AddToCartRequest) => {
        set({ loading: true, error: null });
        try {
            await addToCart(data);
            // re-fetch cart to get updated state from backend
            const updated = await getCart();
            set({
                items: updated.items,
                cartCount: updated.cart_count,
                cartTotal: updated.cart_total,
                loading: false,
            });
        } catch (error) {
            set({ error: "Failed to add item", loading: false });
            console.error("addItem failed:", error);
        }
    },

    removeItem: async (product_id: string, quantity: number) => {
        set({ loading: true, error: null });
        try {
            await removeFromCart({ product_id, quantity });
            const updated = await getCart();
            set({
                items: updated.items,
                cartCount: updated.cart_count,
                cartTotal: updated.cart_total,
                loading: false,
            });
        } catch (error) {
            set({ error: "Failed to remove item", loading: false });
            console.error("removeItem failed:", error);
        }
    },

    clearItems: async () => {
        set({ loading: true, error: null });
        try {
            await clearCart();
            set({
                items: [],
                cartCount: 0,
                cartTotal: "0",
                loading: false,
            });
        } catch (error) {
            set({ error: "Failed to clear cart", loading: false });
            console.error("clearItems failed:", error);
        }
    },
}))