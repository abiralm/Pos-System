'use client'

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/src/services/api";
import { ProductListType } from "@/src/types/product_types";
import Link from "next/link";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { SearchBar } from "./_components/SearchBar";
import { TaskFilters } from "./_components/TaskFilters";
import { CartSheet } from "./_components/CartSheet";
import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/src/store/cartStore";

export default function Home() {

  const [products, setProducts] = useState<ProductListType[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string[]>(["All"]);
  const [offset, setOffset] = useState<number>(0);
  const limit = 10;
  const [totalCount, setTotalCount] = useState<number>(0);
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { items, cartTotal, cartCount, fetchCart, addItem, removeItem, clearItems } = useCartStore()

  const fetchProducts = useCallback(async (query?: string, currentOffset = 0) => {
    try {
      const response = await getProducts(query, limit, currentOffset);
      if (response) {
        setProducts(response.results);
        setTotalCount(response.count);
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value === "") {
      setOffset(0);
      fetchProducts(undefined, 0);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setOffset(0);
      fetchProducts(value, 0);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (e: any) {
      console.log("Invalid username or password")
    }
  }

  return (
    <main className="m-6">

      <div className="w-full flex flex-col gap-4 p-2 m-2">
        <div className="flex justify-between">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onSearch={() => fetchProducts(searchQuery)}
          />
        </div>
        <TaskFilters />

      </div>

      <div className="p-2 m-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <div className="col-span-1 md:col-span-2 lg:col-span-4 text-5xl font-bold">All Items</div>

        {/* renders cards */}
        {products &&
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden rounded-xl pt-0 border-0">
              <CardContent className="p-0">
                <div className="h-64 w-full relative">
                  <img
                    src="/chips.jpg"
                    alt={product.name}
                    className="h-full w-full object-cover relative"
                  />
                  <Badge className="rounded-2xl absolute z-10 top-2 right-2">In Stock: {product.stock}</Badge>
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
                {/* <Button asChild className="bg-emerald-700"><Link href=''>Add to Cart</Link></Button> */}
                <Button asChild className="bg-emerald-700" onClick={() => addItem({ product_id: product.id, quantity: '1' })}
                ><Link href=''>Add to Cart</Link></Button>
                <Button asChild className="bg-blue-500"><Link href={`catalog/${product.slug}`}>Details</Link></Button>
              </CardFooter>
            </Card>
          ))}

        <div className="flex justify-between items-center mt-6 col-span-1 md:col-span-2 lg:col-span-4">
          <Button 
            disabled={offset === 0} 
            onClick={() => {
              const newOffset = offset - limit;
              setOffset(newOffset);
              fetchProducts(searchQuery, newOffset);
            }}
          >
            Previous
          </Button>
          <span className="font-medium text-gray-700">
            Showing {totalCount === 0 ? 0 : offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount}
          </span>
          <Button 
            disabled={offset + limit >= totalCount} 
            onClick={() => {
              const newOffset = offset + limit;
              setOffset(newOffset);
              fetchProducts(searchQuery, newOffset);
            }}
          >
            Next
          </Button>
        </div>
      </div>

      <CartSheet />
    </main>
  );
}
