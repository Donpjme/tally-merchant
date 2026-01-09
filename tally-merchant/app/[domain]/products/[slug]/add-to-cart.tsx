'use client'

import { addToCart } from '@/app/actions'
import { Loader2, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export function AddToCartButton({ storeId, productId }: { storeId: string; productId: string }) {
  const [isPending, setIsPending] = useState(false)

  async function handleAddToCart() {
    setIsPending(true)
    const result = await addToCart(storeId, productId, 1)
    setIsPending(false)

    if (result?.error) {
      alert(result.error)
    } else {
      alert('Added to cart!')
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending}
      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-5 w-5" />
      )}
      Add to Cart
    </button>
  )
}