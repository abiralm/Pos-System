
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProductBySlug } from '@/src/services/api'
import { ProductListType } from '@/src/types/product_types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/src/store/cartStore'
import { ArrowLeft, Loader2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { getProductImageUrl } from '@/lib/utils'
import { CartSheet } from '../_components/CartSheet'

const Page = () => {
    const params = useParams()
    const router = useRouter()
    const slug = params?.id as string
    const [product, setProduct] = useState<ProductListType | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { addItem } = useCartStore()

    useEffect(() => {
        if (!slug) return
        const fetchProduct = async () => {
            try {
                setLoading(true)
                const data = await getProductBySlug(slug)
                setProduct(data)
            } catch (err) {
                console.error("Failed to load product details", err)
                setError("Product not found or failed to load.")
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [slug])
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="m-8 max-w-xl mx-auto text-center space-y-4">
                <p className="text-red-500 font-semibold">{error || "Product not found."}</p>
                <Button asChild variant="outline">
                    <Link href="/catalog">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
                    </Link>
                </Button>
            </div>
        )
    }

    const formatKey = (key: string) => {
        return key
            .replace(/_/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, (char) => char.toUpperCase())
    }

    const formatValue = (value: any): string => {
        if (typeof value === 'boolean') return value ? 'Yes' : 'No'
        if (Array.isArray(value)) return value.join(', ')
        if (typeof value === 'object' && value !== null) return JSON.stringify(value)
        return String(value)
    }

    let specEntries: [string, any][] = []
    if (product.specifications) {
        if (typeof product.specifications === 'object' && !Array.isArray(product.specifications)) {
            specEntries = Object.entries(product.specifications)
        } else if (typeof product.specifications === 'string') {
            try {
                const parsed = JSON.parse(product.specifications)
                if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                    specEntries = Object.entries(parsed)
                }
            } catch (_) {
                // Raw text specification
                specEntries = [["Details", product.specifications]]
            }
        }
    }

    return (
        <main className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <Button asChild variant="ghost">
                    <Link href="/catalog">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
                    </Link>
                </Button>
                <CartSheet />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
                {/* Image Section */}
                <div className="relative h-80 md:h-96 w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    <img
                        src={getProductImageUrl(product.image)}
                        alt={product.name}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/chips.jpg"
                        }}
                        className="h-full w-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 rounded-full text-sm">
                        In Stock: {product.stock}
                    </Badge>
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        {product.category && (
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                                {product.category.name}
                            </span>
                        )}
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {product.name}
                        </h1>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            ${product.price}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {product.description || "No description provided."}
                        </p>

                        {specEntries.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    Additional Details:
                                </h3>
                                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                                    {specEntries.map(([key, value]) => (
                                        <li key={key} className="leading-normal">
                                            <span className="font-medium text-slate-800 dark:text-slate-200">
                                                {formatKey(key)}:
                                            </span>{" "}
                                            <span>{formatValue(value)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                            disabled={!product.available || product.stock <= 0}
                            onClick={() => addItem({ product_id: product.id, quantity: '1' })}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {product.available && product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Page