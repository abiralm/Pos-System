"use client"

import React, { useState } from 'react'
import { LoginCard } from './_components/LoginCard'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Image from 'next/image'


const Login = () => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    React.useEffect(() => {
        if (!api) {
            return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className='grid grid-cols-5'>
            <div className='col-span-3 flex flex-col items-center justify-center'>
                <div className="mx-auto max-w-lg">
                    {/* <Carousel setApi={setApi} className="w-full max-w-md">
                        <CarouselContent>
                            {Array.from({ length: 1 }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <Card className="m-px">
                                        <CardContent className="flex aspect-square items-center justify-center p-6"> */}
                    <Image src="/3.svg" alt="" width={800} height={800} />
                    {/* </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel> */}
                </div>
            </div>
            <div className='col-span-2'>
                <LoginCard />
            </div>
        </div>

    )
}

export default Login