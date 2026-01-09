import React from 'react';
import { DashboardLayout } from './dashboard-layout';

export function MerchantDashboard() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Header Section */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm opacity-70 mt-1">
              Overview of your store&apos;s performance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-current px-4 py-2 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
              Download Report
            </button>
            <button className="rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
              Add Product
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Total Revenue" value="$45,231.89" change="+20.1% from last month" />
          <DashboardCard title="Subscriptions" value="+2350" change="+180.1% from last month" />
          <DashboardCard title="Sales" value="+12,234" change="+19% from last month" />
          <DashboardCard title="Active Now" value="+573" change="+201 since last hour" />
        </div>

        {/* Main Content Area */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 lg:col-span-4">
            <h3 className="font-semibold mb-4">Overview</h3>
            <div className="h-[200px] w-full rounded-md bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-sm text-gray-500">
              Chart Placeholder
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 lg:col-span-3">
            <h3 className="font-semibold mb-4">Recent Sales</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800" />
                  <div className="text-sm">
                    <p className="font-medium">Olivia Martin</p>
                    <p className="text-xs opacity-70">olivia.martin@email.com</p>
                  </div>
                </div>
                <div className="text-sm font-medium">+$1,999.00</div>
              </div>
              {/* Add more list items as needed */}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6">
            <h3 className="font-semibold">Recent Orders</h3>
            <p className="text-sm opacity-70 mt-1">Recent transactions from your store.</p>
          </div>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b [&_tr]:border-gray-200 dark:[&_tr]:border-gray-800">
                <tr className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                  <th className="h-12 px-4 align-middle font-medium opacity-70">Order</th>
                  <th className="h-12 px-4 align-middle font-medium opacity-70">Customer</th>
                  <th className="h-12 px-4 align-middle font-medium opacity-70">Status</th>
                  <th className="h-12 px-4 align-middle font-medium opacity-70">Date</th>
                  <th className="h-12 px-4 align-middle font-medium opacity-70 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                    <td className="p-4 align-middle font-medium">{order.id}</td>
                    <td className="p-4 align-middle">
                      <div>{order.customer}</div>
                      <div className="text-xs opacity-70">{order.email}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                        order.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{order.date}</td>
                    <td className="p-4 align-middle text-right">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DashboardCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
      <h3 className="text-sm font-medium opacity-70">{title}</h3>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <p className="text-xs opacity-70 mt-1">{change}</p>
    </div>
  );
}

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Liam Johnson",
    email: "liam@example.com",
    amount: "$250.00",
    status: "Paid",
    date: "2023-06-23",
  },
  {
    id: "ORD-002",
    customer: "Olivia Smith",
    email: "olivia@example.com",
    amount: "$150.00",
    status: "Pending",
    date: "2023-06-24",
  },
  {
    id: "ORD-003",
    customer: "Noah Williams",
    email: "noah@example.com",
    amount: "$350.00",
    status: "Paid",
    date: "2023-06-25",
  },
  {
    id: "ORD-004",
    customer: "Emma Brown",
    email: "emma@example.com",
    amount: "$450.00",
    status: "Refunded",
    date: "2023-06-26",
  },
  {
    id: "ORD-005",
    customer: "Ava Jones",
    email: "ava@example.com",
    amount: "$550.00",
    status: "Paid",
    date: "2023-06-27",
  },
];