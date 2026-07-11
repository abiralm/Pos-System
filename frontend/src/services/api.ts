import { CatalogType, ProductListType } from "../types/product_types";
import { axiosInstance } from "./instance";

export const getProducts = async (query?: string): Promise<CatalogType> => {
    try {
        const params = query ? { search: query } : {};
        const response = await axiosInstance.get(`/api/products/?available=true`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};