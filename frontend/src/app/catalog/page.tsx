'use client'

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export default function Home() {
  return (
    <main className="m-6">
      <div className="p-2 m-2 border-2 border-amber-500 grid grid-cols-4 gap-8">

        <Card className="overflow-hidden rounded-xl pt-0">
          <CardContent className="p-0">
            <div className="h-64 w-full">
              <img
                src="/6318.png"
                alt="Coca Cola"
                className="h-full w-full object-cover"
              />
            </div>
          </CardContent>

          <CardHeader>
            <CardTitle>Coca Cola</CardTitle>
            <CardDescription className="line-clamp-3">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nobis dolor officia commodi consequatur temporibus totam distinctio asperiores! Laudantium magni quae earum. Voluptates quod numquam eum dolorum a? Repellendus, reiciendis natus.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex gap-2">
              <Button className="bg-emerald-700">Add to Cart</Button>
              <Button className="bg-blue-500">Details</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
