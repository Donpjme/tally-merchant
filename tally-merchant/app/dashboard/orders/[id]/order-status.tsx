'use client'

import { updateOrderStatus } from '@/app/actions'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    setIsUpdating(true)
    await updateOrderStatus(orderId, newStatus)
    setIsUpdating(false)
  }

  return (
    <div className="flex items-center gap-2">
      {isUpdating && <Loader2 className="animate-spin text-indigo-600" size={16} />}
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className="rounded-md border-gray-300 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
      >
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="shipped">Shipped</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  )
}