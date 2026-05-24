import { ProductListType } from "../types/product_types";
import { axiosInstance } from "./instance";

export const getProducts = async ():Promise<ProductListType[]> => {
    try {
        const response = await axiosInstance.get("/api/products/");
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};