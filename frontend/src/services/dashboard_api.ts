import { axiosInstance } from "./instance";
import {
    DashboardStatsResponse,
    DashboardChartsResponse,
    DashboardTopProductsResponse,
    DashboardLowStockResponse,
    DashboardRecentOrdersResponse
} from "../types/dashboard_types";

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
    try {
        const response = await axiosInstance.get("/api/dashboard/stats/");
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};

export const getDashboardCharts = async (range: string = "7d"): Promise<DashboardChartsResponse> => {
    try {
        const response = await axiosInstance.get(`/api/dashboard/charts/`, {
            params: { range }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard charts:", error);
        throw error;
    }
};

export const getDashboardTopProducts = async (): Promise<DashboardTopProductsResponse> => {
    try {
        const response = await axiosInstance.get("/api/dashboard/top-products/");
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard top products:", error);
        throw error;
    }
};

export const getDashboardLowStock = async (): Promise<DashboardLowStockResponse> => {
    try {
        const response = await axiosInstance.get("/api/dashboard/low-stock/");
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard low stock:", error);
        throw error;
    }
};

export const getDashboardRecentOrders = async (): Promise<DashboardRecentOrdersResponse> => {
    try {
        const response = await axiosInstance.get("/api/dashboard/recent-orders/");
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard recent orders:", error);
        throw error;
    }
};
