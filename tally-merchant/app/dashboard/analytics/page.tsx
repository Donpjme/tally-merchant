import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { TrendingUp, DollarSign, ShoppingCart, Activity } from 'lucide-react'

export default async function AnalyticsPage() {
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

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!store) redirect('/onboarding')

  // Fetch orders for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount, created_at, status')
    .eq('store_id', store.id)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true })

  // Process Data for Charts
  const salesByDate = new Map<string, number>()
  let totalRevenue = 0
  let totalOrders = 0

  if (orders) {
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const current = salesByDate.get(date) || 0
      salesByDate.set(date, current + order.total_amount)
      
      totalRevenue += order.total_amount
      totalOrders += 1
    })
  }

  const chartData = Array.from(salesByDate.entries()).map(([date, amount]) => ({ date, amount }))
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Calculate max amount for chart scaling (avoid division by zero)
  const maxAmount = Math.max(...chartData.map(d => d.amount), 1)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Revenue (30d)</p>
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(totalRevenue)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Orders (30d)</p>
            <div className="rounded-full bg-blue-50 p-2 text-blue-600">
              <ShoppingCart size={20} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalOrders}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Avg. Order Value</p>
            <div className="rounded-full bg-purple-50 p-2 text-purple-600">
              <Activity size={20} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(averageOrderValue)}
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 font-semibold text-slate-900 flex items-center gap-2">
          <TrendingUp size={18} className="text-slate-400" />
          Sales Trend
        </h3>
        
        {chartData.length > 0 ? (
          <div className="h-64 w-full flex items-end justify-between gap-2">
            {chartData.map((data, index) => {
              const heightPercentage = (data.amount / maxAmount) * 100
              
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                  <div 
                    className="w-full bg-indigo-100 rounded-t-sm hover:bg-indigo-200 transition-all relative"
                    style={{ height: `${Math.max(heightPercentage, 1)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(data.amount)}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 rotate-0 truncate w-full text-center">{data.date}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
            No sales data available for this period.
          </div>
        )}
      </div>
    </div>
  )
}