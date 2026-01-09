import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Users, Mail } from 'lucide-react'
import { type Order } from '@/app/index'

export default async function CustomersPage() {
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

  // 1. Get Current User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 2. Get User's Store
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!store) return null

  // 3. Fetch All Orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  // 4. Process Unique Customers
  const customersMap = new Map<string, {
    name: string
    email: string
    totalOrders: number
    totalSpent: number
    lastOrderDate: string
  }>()

  if (orders) {
    orders.forEach((order: Order) => {
      if (!customersMap.has(order.customer_email)) {
        customersMap.set(order.customer_email, {
          name: order.customer_name,
          email: order.customer_email,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.created_at // First one found is latest due to sort order
        })
      }

      const customer = customersMap.get(order.customer_email)!
      customer.totalOrders += 1
      
      if (order.status !== 'cancelled') {
          customer.totalSpent += order.total_amount
      }
    })
  }

  const customers = Array.from(customersMap.values())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
      </div>

      {!customers || customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Users size={24} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No customers yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Customers who place orders will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                  <th className="px-6 py-4 font-medium text-right">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr key={customer.email} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      {customer.email}
                    </td>
                    <td className="px-6 py-4">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {new Date(customer.lastOrderDate).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}