'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/cartStore";
import { useAuthStore } from "@/src/store/authStore";
import { checkoutCart, processPayment } from "@/src/services/payment_api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, ShoppingCart, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, cartTotal, cartCount, clearItems } = useCartStore();
    const { user } = useAuthStore();

    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Pre-fill user details if logged in
    useEffect(() => {
        if (user) {
            setCustomerName(user.username || "");
            //setEmail(user.email || "");
        }
    }, [user]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            setErrorMsg("Your cart is empty.");
            return;
        }

        setIsProcessing(true);
        setErrorMsg(null);

        try {
            const checkoutRes = await checkoutCart({
                customer_name: customerName,
                email: email,
            });

            const orderId = checkoutRes.order_id;

            const paymentRes = await processPayment({
                order_id: orderId,
                method: "card",
            });

            if (paymentRes.checkout_url) {
                window.location.href = paymentRes.checkout_url;
            } else {
                throw new Error("Stripe checkout URL was not returned from the server.");
            }
        } catch (error: any) {
            console.error("Order processing failed:", error);
            setErrorMsg(
                error.response?.data?.error || 
                error.response?.data?.message || 
                "Failed to place order. Please try again."
            );
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && !isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50p-6">
                <Card className="max-w-md w-full text-center shadow-xl border border-slate-200/50 backdrop-blur-md">
                    <CardHeader className="flex flex-col items-center pt-8">
                        <div className="p-4 text-emerald-600 mb-4">
                            <ShoppingCart className="w-12 h-12" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Your cart is empty</CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
                            Add some products to your cart before proceeding to checkout.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center pb-8">
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200">
                            <Link href="/catalog" className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Go to Catalog
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Button asChild variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600">
                        <Link href="/catalog" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Catalog
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Checkout
                    </h1>
                    <div className="w-20"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Customer Info Form */}
                    <div className="lg:col-span-7">
                        <Card className="shadow-lg border-slate-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    Customer Information
                                </CardTitle>
                                <CardDescription>
                                    Please enter your billing details. We will email you the receipt.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePlaceOrder} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="customer_name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="customer_name"
                                            type="text"
                                            required
                                            placeholder="Enter your name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full px-4 py-2 border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            disabled={isProcessing}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="Enter you email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-2 border-slate-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            disabled={isProcessing}
                                        />
                                    </div>

                                    <Separator className="my-6" />

                                    <div className="space-y-4">
                                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Payment Method
                                        </Label>
                                        
                                        {/* Card Selection */}
                                        <div className="relative flex items-center justify-between p-4 border-2 border-emerald-500 bg-emerald-50/20 rounded-xl cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">Credit / Debit Card</p>
                                                </div>
                                            </div>
                                            <div className="w-4 h-4 rounded-full border-4 border-emerald-500 bg-white dark:bg-zinc-950"></div>
                                        </div>
                                        
                                        {/* Cash Selection - On Hold placeholder */}
                                        <div className="opacity-40 relative flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-not-allowed">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 rounded-lg">
                                                    <span className="text-sm font-semibold">$</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-600 dark:text-slate-400">Cash </p>
                                                </div>
                                            </div>
                                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-zinc-700"></div>
                                        </div>
                                    </div>

                                    {errorMsg && (
                                        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200text-red-600text-sm rounded-lg">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing Order...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Pay Rs. {cartTotal}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/*Order Summary */}
                    <div className="lg:col-span-5">
                        <Card className="shadow-lg border-slate-200/60 dark:border-zinc-800/60 bg-white/70 sticky top-6">
                            <CardHeader className="border-b border-slate-100 dark:border-zinc-800">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    Order Summary ({cartCount} Items)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="max-h-75 overflow-y-auto space-y-4 pr-1">
                                    {items.map((item) => (
                                        <div key={item.product_id} className="flex justify-between items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white whitespace-nowrap">
                                                Rs. {item.total_price}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                                        <span>Subtotal</span>
                                        <span>Rs. {cartTotal}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2">
                                        <span>Grand Total</span>
                                        <span className="text-emerald-700 dark:text-emerald-400">Rs. {cartTotal}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
