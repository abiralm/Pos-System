import { create } from 'zustand';
import { CartItemType, CartResponse } from '../types/cart_types';
import { getCart } from '../services/cart_api';


interface CartState {
    items: CartItemType[];
    cartTotal: string;
    cartCount: number;

    fetchCart: () => void
}

export const useCartStore = create<CartState>()((set) => ({
    items: [],
    cartTotal: "0",
    cartCount: 0,

    fetchCart: async () => {
        try {
            const data = await getCart();

            set({
                items: data.items,
                cartCount: data.cart_count,
                cartTotal: data.cart_total
            })
        } finally {
            console.log("Finally block")
        }
    },
}))