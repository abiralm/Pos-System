export type OrderItem = {
    id: number;
    product_name: string;
    price: string;
    quantity: number;
    cost: string;
}

export type Order = {
    id: number;
    customer_name: string;
    email: string;
    status: string;
    created: string;
    updated: string;
    discount: string;
    tax: string;
    sub_total: string;
    grand_total: string;
    items: OrderItem[];
}
