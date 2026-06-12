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

                <div className='overflow-y-auto'>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                    <div className=' p-2'>
                        <div className='flex justify-between mb-4'>
                            <h1>Coco Cola</h1>
                            <h2>Rs.20</h2>
                        </div>

                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Button>+</Button>
                                <h1>1</h1>
                                <Button>-</Button>
                            </div>
                            <Button>Remove</Button>
                        </div>

                    </div>

                </div >

                <SheetFooter>
                    <Button type="submit">Save changes</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>

        </Sheet>

    )
}

