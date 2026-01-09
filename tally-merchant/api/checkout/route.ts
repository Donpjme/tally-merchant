import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // 1. Get User & Store ID
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { storeId, cartItems, domain, paymentMethod } = await request.json()

  // 2. Calculate Total Amount
  const totalAmount = cartItems.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0)

  // 3. Create Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      store_id: storeId,
      user_id: user.id,
      customer_name: user.user_metadata?.full_name || 'Valued Customer',
      customer_email: user.email,
      total_amount: totalAmount,
      status: 'pending'
    }]).select().single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  // 4. Create Order Items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderItemsData = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 })
  }

  // 4. Handle WhatsApp Checkout (Skip Payment Gateway)
  if (paymentMethod === 'whatsapp') {
    return NextResponse.json({ order, whatsapp: true }, { status: 200 })
  }

  // 5. Initialize Paystack Transaction
  const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: user.email,
      amount: totalAmount * 100, // Paystack expects amount in kobo
      callback_url: `${request.headers.get('origin')}/${domain}/order-confirmation`,
      metadata: {
        order_id: order.id
      }
    })
  })

  const paystackData = await paystackResponse.json()

  if (!paystackData.status) {
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
  }

  return NextResponse.json({ order, paymentUrl: paystackData.data.authorization_url }, { status: 200 })
}

export const dynamic = 'force-dynamic'
