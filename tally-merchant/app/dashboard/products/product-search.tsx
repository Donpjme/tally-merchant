'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'

export function ProductSearch() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = (term: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (term) {
        params.set('query', term)
      } else {
        params.delete('query')
      }
      replace(`/dashboard/products?${params.toString()}`)
    }, 300)
  }

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    replace(`/dashboard/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <input
          type="search"
          placeholder="Search products..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-9 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <select
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        defaultValue={searchParams.get('status')?.toString() || 'all'}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  )
}