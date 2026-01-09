import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, Mail, User } from 'lucide-react'
import { OrderStatusSelector } from './order-status'

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get User's Store
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!store) redirect('/onboarding')

  // Fetch Order with Items
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, images))')
    .eq('id', id)
    .eq('store_id', store.id)
    .single()

  if (!order) notFound()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/orders"
            className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.created_at).toLocaleDateString('en-NG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Items</h2>
            </div>
            <ul role="list" className="divide-y divide-gray-100">
              {order.order_items && order.order_items.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                order.order_items.map((item: any) => (
                  <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      {item.products?.images?.[0] ? (
                        <Image
                          src={item.products.images[0]}
                          alt={item.products.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.products?.name || 'Unknown Product'}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right font-medium text-gray-900">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.price * item.quantity)}
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-8 text-center text-gray-500">No items found for this order.</li>
              )}
            </ul>
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.total_amount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Customer Info */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Customer</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{order.customer_email}</p>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}