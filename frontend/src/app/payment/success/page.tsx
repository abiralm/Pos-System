'use client'

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/src/store/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Home, ShoppingBag, ArrowRight, Clipboard } from "lucide-react";
import Link from "next/link";
import { verifyPayment } from "@/src/services/payment_api";

function SuccessContent() {
    const searchParams = useSearchParams();
    const { clearItems } = useCartStore();

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "verified" | "failed">("loading");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const session = searchParams.get("session_id");
        if (!session) {
            setStatus("failed");
            setErrorMsg("No session ID found in URL.");
            return;
        }
        setSessionId(session);

        const verify = async () => {
            try {
                const res = await verifyPayment(session);
                if (res.verified) {
                    clearItems();
                    setStatus("verified");
                } else {
                    setStatus("failed");
                    setErrorMsg(res.error || "Payment could not be verified.");
                }
            } catch (err: any) {
                // 202 means webhook hasn't fired yet — retry once after delay
                if (err.response?.status === 202) {
                    setTimeout(async () => {
                        try {
                            const retry = await verifyPayment(session);
                            if (retry.verified) {
                                clearItems();
                                setStatus("verified");
                            } else {
                                setStatus("failed");
                                setErrorMsg("Payment not confirmed. Please contact support.");
                            }
                        } catch {
                            setStatus("failed");
                            setErrorMsg("Payment not confirmed. Please contact support.");
                        }
                    }, 3000);
                } else {
                    setStatus("failed");
                    setErrorMsg(err.response?.data?.error || "Verification failed.");
                }
            }
        };

        verify();
    }, [searchParams]);

    const handleCopy = () => {
        if (sessionId) {
            navigator.clipboard.writeText(sessionId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <p className="text-slate-500 dark:text-slate-400">Verifying your payment...</p>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center shadow-xl border-slate-200/50">
                    <CardHeader>
                        <CardTitle className="text-rose-600">Payment Not Verified</CardTitle>
                        <CardDescription>{errorMsg}</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center gap-3">
                        <Button asChild variant="outline">
                            <Link href="/catalog">Go to Catalog</Link>
                        </Button>
                        <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white">
                            <Link href="/checkout">Retry Payment</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="max-w-xl w-full shadow-2xl border-slate-200/50 bg-white/80 overflow-hidden pt-0!">

                <div className="bg-emerald-600 dark:bg-emerald-700 py-8 flex flex-col items-center justify-center text-white">
                    <div className="p-3 bg-white/10 rounded-full mb-3 ">
                        <CheckCircle2 className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Payment Successful!</h1>
                    <p className="text-emerald-100 mt-1">Thank you for your purchase</p>
                </div>

                <CardHeader className="text-center pt-8">
                    <CardTitle className="text-2xl font-bold text-slate-800">Order Confirmed</CardTitle>
                    <CardDescription className="text-slate-500 mt-2">
                        A confirmation email with details of your order has been sent.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 space-y-6">
                    {sessionId && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 ">
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                Transaction ID
                            </p>
                            <div className="flex items-center justify-between gap-2">
                                <code className="text-xs font-mono text-slate-600 dark:text-slate-300 break-all select-all">
                                    {sessionId}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="p-2 h-auto text-slate-500 hover:text-emerald-600 shrink-0"
                                    title="Copy Transaction ID"
                                >
                                    {copied ? (
                                        <span className="text-xs text-emerald-600 font-semibold">Copied!</span>
                                    ) : (
                                        <Clipboard className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                </CardContent>

                <CardFooter className="px-8 pb-8 pt-4 flex flex-col sm:flex-row gap-4 justify-between border-t border-slate-100 mt-6 bg-slate-50/50 py-6">
                    <Button asChild variant="outline" className="w-full sm:w-auto border-slate-200  flex items-center justify-center gap-2">
                        <Link href="/catalog">
                            <Home className="w-4 h-4" /> Catalog Dashboard
                        </Link>
                    </Button>

                    <Button asChild className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2">
                        <Link href="/catalog">
                            Shop More <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
                <p className="text-slate-500 dark:text-slate-400">Loading payment success status...</p>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
