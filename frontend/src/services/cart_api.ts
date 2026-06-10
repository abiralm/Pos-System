import { AddToCartRequest, AddToCartResponse, CartResponseType } from "../types/cart_types";
import { axiosInstance } from "./instance";

export const getCart = async (): Promise<CartResponseType> => {
    try {
        const response = await axiosInstance.get("/api/cart/");
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
}


export const addToCart = async(data:AddToCartRequest): Promise<AddToCartResponse>=> {
    try {
        const response = await axiosInstance.post("/api/cart/add",data);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
}


export const removeFromCart = async (data: { product_id: string, quantity: number }): Promise<void> => {
    try {
        const response = await axiosInstance.post("/api/cart/remove",data);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
}


export const clearCart = async(): Promise<string>=> {
    try {
        const response = await axiosInstance.post("/api/cart/clear");
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}