export type CheckoutRequest ={
    customer_name: string;
    email: string;
}

export type CheckoutResponse ={
    message: string;
    order_id: number;
    total: number;
}

export type PaymentRequest ={
    order_id: number;
    method: 'cash' | 'card';
}

export type PaymentResponse ={
    checkout_url: string | null;
    message?: string;
    payment_id?: number;
}