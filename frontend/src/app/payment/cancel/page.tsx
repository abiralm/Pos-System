'use client'

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="max-w-md w-full shadow-2xl border-slate-200/50 bg-white/80 overflow-hidden pt-0!">
                {/* Cancel Banner */}
                <div className="bg-rose-600 py-8 flex flex-col items-center justify-center text-white">
                    <div className="p-3 bg-white/10 rounded-full mb-3">
                        <AlertTriangle className="w-12 h-12 text-white animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Payment Cancelled</h1>
                    <p className="text-rose-100 mt-1">Your transaction was not completed</p>
                </div>

                <CardHeader className="text-center pt-8">
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">Transaction Stopped</CardTitle>
                    {/* <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
                        You cancelled the payment process or your payment could not be processed. No funds have been charged from your card.
                    </CardDescription> */}
                </CardHeader>

                <CardContent className="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    If you ran into issues during the payment window, you can go back to your checkout page to retry payment or adjust details.
                </CardContent>

                <CardFooter className="px-8 pb-8 pt-4 flex flex-col sm:flex-row gap-4 justify-between border-t border-slate-100 mt-6 bg-slate-50/50  py-6">
                    <Button asChild variant="outline" className="w-full sm:w-auto border-slate-200 flex items-center justify-center gap-2">
                        <Link href="/catalog">
                            <Home className="w-4 h-4" /> Go to Catalog
                        </Link>
                    </Button>
                    
                    <Button asChild className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2">
                        <Link href="/checkout">
                            <RefreshCw className="w-4 h-4" /> Retry Payment
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
