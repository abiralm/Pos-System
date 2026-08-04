export interface DashboardKPIs {
    todays_sales: number;
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
}

export interface OrderStatusBreakdown {
    paid: number;
    pending: number;
    cancelled: number;
}

export interface DashboardStatsResponse {
    kpis: DashboardKPIs;
    order_status: OrderStatusBreakdown;
}

export interface SalesChartDataPoint {
    date: string;
    revenue: number;
    orders: number;
}

export interface DashboardChartsResponse {
    sales_chart: SalesChartDataPoint[];
}

export interface TopProduct {
    product_id: number;
    name: string;
    total_quantity: number;
    total_revenue: number;
}

export interface DashboardTopProductsResponse {
    top_selling_products: TopProduct[];
}

export interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
    price: number;
}

export interface DashboardLowStockResponse {
    low_stock_products: LowStockProduct[];
}

export interface RecentOrder {
    id: number;
    customer_name: string;
    email: string;
    status: string;
    items_count: number;
    total: number;
    created: string;
}

export interface DashboardRecentOrdersResponse {
    recent_orders: RecentOrder[];
}
