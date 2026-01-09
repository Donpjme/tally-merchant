'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, use } from 'react'
import { updateCartItem, removeFromCart } from '@/app/actions'

type CartItem = {
  id: string
  quantity: number
  price: number
  products: {
    name: string
    images: string[]
    slug: string
  } | null
}

export default function CartPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = use(params)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // 1. Get Store ID
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', domain)
        .single()

      if (!store) {
        setIsLoading(false)
        return
      }

      // 2. Get Cart
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('store_id', store.id)
        .maybeSingle()

      if (!cart) {
        setIsLoading(false)
        return
      }

      // 3. Get Items
      const { data: items } = await supabase
        .from('cart_items')
        .select('id, quantity, price, products(name, images, slug)')
        .eq('cart_id', cart.id)
        .order('created_at', { ascending: true })

      if (items) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedItems = items.map((item: any) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            products: Array.isArray(item.products) ? item.products[0] : item.products
        }))
        setCartItems(formattedItems)
      }
      setIsLoading(false)
    }

    fetchCart()
  }, [domain])

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCartItems(items => items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ))

    const result = await updateCartItem(itemId, newQuantity)
    if (result?.error) {
      alert(result.error)
      window.location.reload()
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Remove this item?')) return

    setCartItems(items => items.filter(item => item.id !== itemId))

    const result = await removeFromCart(itemId)
    if (result?.error) {
      alert(result.error)
      window.location.reload()
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>

        <div className="mt-12">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Start adding products to your cart.</p>
              <div className="mt-6">
                <Link
                  href={`/${domain}`}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex p-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.products?.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                          src={item.products.images[0]}
                          alt={item.products.name}
                          className="h-full w-full object-cover object-center"
                          />
                      ) : (
                          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <ShoppingBag size={24} />
                          </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link href={`/${domain}/products/${item.products?.slug || '#'}`}>{item.products?.name || 'Unknown Product'}</Link>
                          </h3>
                          <p className="ml-4">
                              {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.price * item.quantity)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.price)} each
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center gap-2 rounded-md border border-gray-300 p-1">
                          <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          >
                              <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                          >
                              <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(subtotal)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                      <Link
                          href={`/${domain}/checkout`}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                      >
                          Checkout
                      </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                          or{' '}
                          <Link href={`/${domain}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                          </Link>
                      </p>
                  </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}