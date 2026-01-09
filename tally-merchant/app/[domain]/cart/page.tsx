'use client'

import { useCart } from '@/components/cart-provider'
import { Loader2, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal } = useCart()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>

        <div className="mt-12">
          {items.length === 0 ? (
            /* ─── EMPTY STATE ─── */
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-20 text-center">
              <div className="rounded-full bg-gray-100 p-6">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Cart is empty</h3>
              <p className="mt-2 text-sm text-gray-500">Looks like you haven&apos;t added anything yet.</p>
              <div className="mt-8">
                {/* Links back to the store homepage */}
                <Link
                  href="/"
                  className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            /* ─── FILLED STATE ─── */
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              <section className="lg:col-span-7">
                <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
                  {items.map((item) => (
                    <li key={item.id} className="flex p-6 sm:py-10">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                            <ShoppingBag size={24} />
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm font-semibold text-gray-900">
                                <Link href={`/products/${item.id}`} className="hover:underline">
                                  {item.name}
                                </Link>
                              </h3>
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.price)}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <div className="flex items-center rounded-md border border-gray-300 w-fit">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 text-sm font-medium text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="absolute top-0 right-0">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500"
                              >
                                <span className="sr-only">Remove</span>
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">Order total</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(cartTotal)}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/checkout`} 
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 hover:shadow-lg transition-all"
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}