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