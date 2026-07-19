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
        const response = await axiosInstance.post("/api/cart/items/",data);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
}


export const updateCartItem = async (product_id: string, data: { quantity: number }): Promise<void> => {
    try {
        const response = await axiosInstance.patch(`/api/cart/items/${product_id}/`, data);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
    }
}


export const removeCartItem = async (product_id: string): Promise<void> => {
    try {
        const response = await axiosInstance.delete(`/api/cart/items/${product_id}/`);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error removing cart item:", error);
        throw error;
    }
}


export const clearCart = async(): Promise<string>=> {
    try {
        const response = await axiosInstance.delete("/api/cart/");
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}