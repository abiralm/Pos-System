import { CatalogType, ProductQueryParamsType, categoryType } from "../types/product_types";
import { axiosInstance } from "./instance";

export const getProducts = async (query?: string, limit?: number, offset?: number, category?: string): Promise<CatalogType> => {
    try {
        const params: ProductQueryParamsType  = {};
        if (query) params.search = query;
        if (limit !== undefined) params.limit = limit;
        if (offset !== undefined) params.offset = offset;
        if (category && category !== "All") params.category = category;

        const response = await axiosInstance.get(`/api/products/?available=true`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getCategories = async (): Promise<categoryType[]> => {
    try {
        const response = await axiosInstance.get(`/api/products/categories/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};