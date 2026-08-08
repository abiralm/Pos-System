"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/dashboard_api";
import { DashboardKPIs } from "../../types/dashboard_types";
import { ShoppingCart, Users, Box, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardKPIsComponent() {
    const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKPIs = async () => {
            try {
                const data = await getDashboardStats();
                setKpis(data.kpis);
            } catch (error) {
                console.error("Failed to fetch KPI stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchKPIs();
    }, []);

    if (loading || !kpis) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xs border border-zinc-100 dark:border-zinc-800 animate-pulse h-36" />
                ))}
            </div>
        );
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(val);
    };

    const cards = [
        {
            title: "Today's Sales",
            value: formatCurrency(kpis.todays_sales),
            icon: ShoppingCart,
            subtext: "Last month:",
            iconBg: "bg-zinc-100 text-zinc-700",
        },
        {
            title: "Total Orders",
            value: kpis.total_orders.toString(),
            icon: Users,
            subtext: "Last month",
            iconBg: "bg-zinc-100 text-zinc-700",
        },
        {
            title: "Pending Orders",
            value: kpis.pending_orders.toString(),
            icon: Box,
            subtext: "Last month",
            iconBg: "bg-zinc-100 text-zinc-700",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(kpis.total_revenue),
            icon: DollarSign,
            subtext: "Last month",
            iconBg: "bg-zinc-100 text-zinc-700",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div
                        key={idx}
                        className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between transition-all hover:shadow-md"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">
                                {card.title}
                            </span>
                            <div className={`p-2.5 rounded-full ${card.iconBg} flex items-center justify-center`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
                                {card.value}
                            </span>
                        </div>

                        {/* <div className="text-zinc-400 dark:text-zinc-500 text-xs mt-3">
                            {card.subtext}
                        </div> */}
                    </div>
                );
            })}
        </div>
    );
}
