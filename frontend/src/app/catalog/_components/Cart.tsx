'use client'

import { useCartStore } from "@/src/store/cartStore";
import { useEffect } from "react";

export default function CartTest() {
    const { items, cartCount, cartTotal, fetchCart } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, []);

    console.log("store",useCartStore.getState());

    return (
        <div>
            <h2>Cart Test</h2>

            <p>Count: {cartCount}</p>
            <p>Total: {cartTotal}</p>

            <ul>
                {items.map((item) => (
                    <li key={item.product_id}>
                        {item.name} - {item.quantity} × {item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}