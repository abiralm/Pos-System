"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import DashboardKPIsComponent from "../components/dashboard/DashboardKPIs";
import RevenueAnalytics from "../components/dashboard/RevenueAnalytics";
import TotalIncome from "../components/dashboard/TotalIncome";
import RecentOrders from "../components/dashboard/RecentOrders";
import InventoryOverview from "../components/dashboard/InventoryOverview";

export default function Home() {
    return (
        // <SidebarProvider>
            <div className="flex h-screen w-full bg-zinc-50 dark:bg-black">
                {/* <AppSidebar /> */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8 space-y-8 max-w-1600px mx-auto">
                        
                        <div className="flex items-center gap-4">
                            {/* <SidebarTrigger className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100" /> */}
                            <div>
                                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                                    Dashboard
                                </h1>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Welcome back!
                                </p>
                            </div>
                        </div>

                        <DashboardKPIsComponent />
                    </div>
                </main>
            </div>
        // </SidebarProvider>
    );
}
