"use client";

import { useEffect, useState, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Order } from "@/src/types/order_types";
import { getOrders } from "@/src/services/order_api";
import { AppSidebar } from "@/src/components/app-sidebar";
import { Eye, Trash, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState<number>(0);
    const limit = 10;
    const [totalCount, setTotalCount] = useState<number>(0);

    const fetchOrders = useCallback(async (currentOffset: number) => {
        setLoading(true);
        try {
            const data = await getOrders(limit, currentOffset);
            if (data) {
                setOrders(data.results || []);
                setTotalCount(data.count || 0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(offset);
    }, [offset, fetchOrders]);

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-slate-50">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger />
                                <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-lg text-slate-500 animate-pulse">Loading orders...</div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                                                <th className="p-4">Order ID</th>
                                                <th className="p-4">Customer</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Total</th>
                                                <th className="p-4">Options</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                                        No orders found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                orders.map((order) => (
                                                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                        <td className="p-4 font-medium text-slate-800">#{order.id}</td>
                                                        <td className="p-4">
                                                            <div>{order.customer_name}</div>
                                                            <div className="text-sm text-slate-500">{order.email}</div>
                                                        </td>
                                                        <td className="p-4 text-slate-600">
                                                            {new Date(order.created).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                                                ${order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                                                    order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                                        'bg-red-100 text-red-800'}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-semibold text-slate-800">
                                                            ${order.grand_total}
                                                        </td>
                                                        <td className="p-4 font-semibold text-slate-800">
                                                            <div className="flex gap-4">
                                                                 <Eye size={18}/>
                                                                 <Trash size={18} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-between items-center p-4 border-t border-slate-200 bg-slate-50">
                                    <span className="text-sm font-medium text-slate-700">
                                        Showing {totalCount === 0 ? 0 : offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={offset === 0}
                                            onClick={() => {
                                                const newOffset = Math.max(0, offset - limit);
                                                setOffset(newOffset);
                                            }}
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={offset + limit >= totalCount}
                                            onClick={() => {
                                                const newOffset = offset + limit;
                                                setOffset(newOffset);
                                            }}
                                        >
                                            Next <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
