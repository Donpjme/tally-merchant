import { createClient } from '@/utils/supabase/server'
import { DollarSign, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { type Order } from '@/app/index'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!store) redirect('/onboarding')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  const allOrders = orders || []
  
  const totalRevenue = allOrders
    .filter(o => ['paid', 'shipped'].includes(o.status))
    .reduce((acc, curr) => acc + curr.total_amount, 0)

  const activeOrdersCount = allOrders.filter(o => o.status === 'pending').length
  const recentOrders = allOrders.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{store.name} Dashboard</h1>
        <Link 
          href="/dashboard/products/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          + New Product
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard 
          title="Total Revenue" 
          value={new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(totalRevenue)} 
          icon={<DollarSign className="text-green-600" />} 
        />
        <KpiCard 
          title="Active Orders" 
          value={activeOrdersCount.toString()} 
          icon={<ShoppingCart className="text-blue-600" />} 
        />
        <KpiCard title="Growth (MoM)" value="+24%" icon={<TrendingUp className="text-indigo-600" />} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Recent Orders</h3>
          <Link href="/dashboard/orders" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="mt-4 h-32 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500 flex flex-col items-center justify-center border border-dashed border-slate-300">
            <p>No orders yet. Start sharing your Tally link!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/dashboard/orders/${order.id}`} className="hover:text-indigo-600 hover:underline">
                        #{order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// FIX: Replaced 'any' with 'React.ReactNode'
interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-full bg-slate-50 p-2 border border-slate-100">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}