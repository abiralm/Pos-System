import React from 'react'
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
import { Input } from '@/components/ui/input'


export const CartSheet = () => {
    return (
        <Sheet>
            <SheetTrigger>Open</SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Cart</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone.
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

