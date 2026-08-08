"use client";

import { useEffect, useState } from "react";
import { getDashboardRecentOrders } from "../../services/dashboard_api";
import { RecentOrder } from "../../types/dashboard_types";
import { Search, ChevronDown, Check } from "lucide-react";

export default function RecentOrders() {
    const [orders, setOrders] = useState<RecentOrder[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getDashboardRecentOrders();
                setOrders(data.recent_orders);
            } catch (error) {
                console.error("Failed to fetch recent orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(val);
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };


    return (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-zinc-955 dark:text-zinc-50">Recent Orders</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all w-60 text-zinc-800 dark:text-zinc-200"
                        />
                    </div>

                </div>
            </div>

            {loading ? (
                <div className="py-12 text-center text-sm text-zinc-400 animate-pulse">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-400">No recent orders found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                <th className="py-4 px-4">Order Id</th>
                                <th className="py-4 px-4">Date</th>
                                <th className="py-4 px-4">Customer</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4">Items</th>
                                <th className="py-4 px-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {orders.map((order, idx) => {
                                return (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 "
                                    >
                                        <td className="py-4 px-4 text-zinc-400 dark:text-zinc-500 font-mono">
                                            #{order.id}
                                        </td>
                                        <td className="py-4 px-4 text-zinc-500 dark:text-zinc-400">
                                            {formatDate(order.created)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-zinc-950 dark:text-zinc-50">
                                                {order.customer_name}
                                            </div>
                                            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
                                                {order.email}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
                                                    order.status === "paid" || order.status === "completed"
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                                        : order.status === "pending"
                                                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                                                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                                }`}
                                            >
                                                {order.status === "paid" ? "Completed" : order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-zinc-500 dark:text-zinc-400">
                                            {order.items_count} {order.items_count === 1 ? "Item" : "Items"}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-zinc-950 dark:text-zinc-50">
                                            {formatCurrency(order.total)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
