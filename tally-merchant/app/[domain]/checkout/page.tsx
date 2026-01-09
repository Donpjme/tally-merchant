'use client'

import { useState, useEffect, use } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { MessageCircle, CreditCard } from 'lucide-react'

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CheckoutPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = use(params)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [store, setStore] = useState<{ id: string; phone: string | null } | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // 1. Get Store ID
      const { data: storeData } = await supabase
        .from('stores')
        .select('id, phone')
        .eq('slug', domain)
        .single()

      if (!storeData) return
      setStore(storeData)

      // 2. Get Cart
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('store_id', storeData.id)
        .maybeSingle()

      if (!cart) return

      // 3. Get Items
      const { data: items } = await supabase
        .from('cart_items')
        .select('id, quantity, price, products(name)')
        .eq('cart_id', cart.id)

      if (items) {
        setCartItems(items.map((item: { id: string; quantity: number; price: number; products: { name: string } | { name: string }[] | null }) => ({
          id: item.id,
          name: (Array.isArray(item.products) ? item.products[0]?.name : item.products?.name) || 'Unknown Item',
          price: item.price,
          quantity: item.quantity
        })))
      }
    }
    fetchCart()
  }, [domain])

  const handlePlaceOrder = async (method: 'card' | 'whatsapp') => {
    if (!store) return

    if (method === 'whatsapp' && !store.phone) {
      alert('This store has not set up a WhatsApp number yet.')
      return
    }

    // Call the API endpoint to create the order
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storeId: store.id, cartItems, domain, paymentMethod: method }),
    })

    const data = await response.json()

    if (response.ok) {
      if (method === 'card' && data.paymentUrl) {
        // Redirect to Paystack
        window.location.href = data.paymentUrl
      } else if (method === 'whatsapp') {
        // Construct WhatsApp Message
        const orderId = data.order.id.slice(0, 8)
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const formattedTotal = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(total)
        
        let message = `*New Order #${orderId}*\n\n`
        cartItems.forEach(item => {
          message += `• ${item.name} (x${item.quantity})\n`
        })
        message += `\n*Total: ${formattedTotal}*`
        message += `\n\nI would like to pay for this order.`

        // Sanitize phone number to remove any non-numeric characters
        const cleanPhone = store.phone?.replace(/[^0-9]/g, '') || ''
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
        window.location.href = url
      }
    } else {
      // Handle error
      console.error('Error placing order:', data.error)
    }
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-2 border-b">
                <span>{item.name} ({item.quantity})</span>
                <span>₦{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold">Total:</span>
            <span>
              ₦{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
          onClick={() => handlePlaceOrder('card')}
        >
          <CreditCard size={20} />
          Pay with Card
        </button>
        
        <button
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
          onClick={() => handlePlaceOrder('whatsapp')}
        >
          <MessageCircle size={20} />
          Checkout via WhatsApp
        </button>
      </div>
    </div>
  )
}