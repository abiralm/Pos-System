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

export const CartSheet = () => {

    const { items, cartTotal, cartCount, fetchCart, addItem, removeItem, clearItems } = useCartStore()

    useEffect(() => {
        fetchCart()
    }, [])

    return (
        <Sheet>
            <SheetTrigger asChild><Button variant="outline">Cart ({cartCount})</Button></SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Cart</SheetTitle>
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
                                    <div className='flex gap-2 items-center'>
                                        {/* + button */}
                                        <Button
                                            size="sm"
                                            onClick={() => addItem({ product_id: item.product_id, quantity: '1' })}
                                        >
                                            +
                                        </Button>

                                        <span>{item.quantity}</span>

                                        {/* - button */}
                                        <Button
                                            size="sm"
                                            onClick={() => removeItem(String(item.product_id), 1)}
                                        >
                                            -
                                        </Button>
                                    </div>

                                    {/* Remove entire item */}
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
                    <div className='flex justify-between font-semibold text-lg'>
                        <span>Total:</span>
                        <span>Rs.{cartTotal}</span>
                    </div>

                    <Button
                        variant="destructive"
                        onClick={() => clearItems()}
                        disabled={cartCount === 0}
                    >
                        Clear Cart
                    </Button>

                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>

        </Sheet>

    )
}

