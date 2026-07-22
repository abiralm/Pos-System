'use client'

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/src/store/cartStore'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus } from "lucide-react"

export const CartSheet = () => {

    const { items, cartTotal, cartCount, fetchCart, addItem, removeItem, clearItems } = useCartStore()
    const router = useRouter()

    useEffect(() => {
        fetchCart()
    }, [])

    return (
        <Sheet>
            <SheetTrigger asChild><Button variant="outline">Cart ({cartCount})</Button></SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold">Cart</SheetTitle>
                    <SheetDescription>
                        {cartCount} item(s) in your cart
                    </SheetDescription>
                </SheetHeader>

                <div className='overflow-y-auto flex-1'>
                    {items.length === 0 ? (
                        <p className='text-center text-muted-foreground mt-4'>Your cart is empty</p>
                    ) : (
                        items.map((item) => (
                            <div key={item.product_id} className='p-2 border-b'>
                                <div className='flex justify-between mb-2'>
                                    <h1>{item.name}</h1>
                                    <h2>Rs.{item.total_price}</h2>
                                </div>

                                <div className='flex justify-between'>
                                    <div className='flex gap-4 items-center'>
                                        <Button size="icon" className="rounded-2xl" onClick={() => addItem({ product_id: item.product_id, quantity: '1' })}><Plus /></Button>
                                        <span className=" text-md font-bold">{item.quantity}</span>
                                        <Button size="icon" className="rounded-2xl" onClick={() => removeItem(String(item.product_id), 1)}><Minus /></Button>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeItem(String(item.product_id), item.quantity)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <SheetFooter className='flex flex-col gap-2'>
                    <div className='flex justify-between  bg-gray-200 p-2 rounded-md items-baseline'>
                        <span>Total:</span>
                        <span className="font-semibold text-lg">Rs. {cartTotal}</span>
                    </div>

                    <SheetClose asChild>
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2"
                            onClick={() => router.push("/checkout")}
                            disabled={cartCount === 0}
                        >
                            Process Transaction
                        </Button>
                    </SheetClose>

                    <Button
                        variant="destructive"
                        onClick={() => clearItems()}
                        disabled={cartCount === 0}
                    >
                        Clear Cart
                    </Button>

                    {/* <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose> */}
                </SheetFooter>
            </SheetContent>

        </Sheet>

    )
}

