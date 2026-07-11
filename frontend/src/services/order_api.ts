import { Order } from "../types/order_types";
import { axiosInstance } from "./instance";

export const getOrders = async (): Promise<Order[]> => {
    try {
        const response = await axiosInstance.get("/api/orders/");
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}
