'use client'

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/src/services/api";
import { ProductListType } from "@/src/types/product_types";
import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { SearchBar } from "./_components/SearchBar";
import { Tabs } from "radix-ui";
import { TaskFilters } from "./_components/TaskFilters";

export default function Home() {

  const [products, setProducts] = useState<ProductListType[]>([])
  const [searchQuery, setSearchQuery] = useState<String>("")
  const [selectedCategory, setSelectedCategory] = useState<String[]>(["All"]);


  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts();
      if (response) {
        console.log(response);
        setProducts(response);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="m-6">
      
      <div className="w-full flex flex-col gap-4 p-2 m-2">
        
        <SearchBar />
        <TaskFilters />
      </div>

      <div className="p-2 m-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* renders cards */}
        {products &&
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden rounded-xl pt-0">
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
                <CardTitle>
                  <div className="flex gap-4 items-center">
                    <h1 className="text-xl">{product.name}</h1>
                    <h2 className="text-emerald-700 font-bold">${product.price}</h2>
                  </div>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex gap-2">
                <Button asChild className="bg-emerald-700"><Link href=''>Add to Cart</Link></Button>
                <Button asChild className="bg-blue-500"><Link href={`catalog/${product.slug}`}>Details</Link></Button>
              </CardFooter>
            </Card>
          ))}
      </div>

    </main>
  );
}
