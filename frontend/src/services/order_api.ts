import { OrderListResponseType } from "../types/order_types";
import { axiosInstance } from "./instance";

export const getOrders = async (limit?: number, offset?: number): Promise<OrderListResponseType> => {
    try {
        const params: { limit?: number; offset?: number } = {};
        if (limit !== undefined) params.limit = limit;
        if (offset !== undefined) params.offset = offset;

        const response = await axiosInstance.get("/api/orders/", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}
