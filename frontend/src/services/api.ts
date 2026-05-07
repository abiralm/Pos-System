import { axiosInstance } from "./instance";

export const fetchCart = async () => {
    try {
        const response = await axiosInstance.get("/api/cart/");
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};