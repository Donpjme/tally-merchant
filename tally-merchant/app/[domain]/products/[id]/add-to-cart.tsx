'use client'

import { useCart } from '@/components/cart-provider'
import { ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'

interface Props {
  productId: string
  storeId: string
  name: string
  price: number
  image?: string
}

export function AddToCartButton({ productId, storeId, name, price, image }: Props) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAdd = () => {
    addItem({ id: productId, storeId, name, price, image })
    
    // Visual feedback
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-white transition-all ${
        isAdded ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {isAdded ? (
        <>
          <Check size={24} />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag size={24} />
          Add to Cart
        </>
      )}
    </button>
  )
}