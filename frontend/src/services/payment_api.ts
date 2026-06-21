import { CheckoutRequest, CheckoutResponse, PaymentRequest, PaymentResponse } from "../types/payment_types";
import { axiosInstance } from "./instance";


export const checkoutCart = async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    try {
        const response = await axiosInstance.post("/api/orders/checkout/", data);
        console.log("Checkout response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error during checkout:", error);
        throw error;
    }
};


export const processPayment = async (data: PaymentRequest): Promise<PaymentResponse> => {
    try {
        const response = await axiosInstance.post("/api/payments/", data);
        console.log("Payment response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error during payment process:", error);
        throw error;
    }
};
