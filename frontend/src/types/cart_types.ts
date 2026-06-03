export type CartItemType = {
    product_id: string,
    name: string,
    price: string,
    quantity: number,
    total_price: string
}

export type CartResponseType = {
    items: CartItemType[];
    cart_total: string;
    cart_count: number;
}

export type AddToCartRequest = {
    product_id: string,
    quantity: string,
}

export type AddToCartResponse = {
    message: string,
    cart_total: string,
    cart_count: Number
}