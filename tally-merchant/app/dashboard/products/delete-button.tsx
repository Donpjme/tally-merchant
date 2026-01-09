'use client'

import { deleteProduct } from '@/app/actions'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function DeleteProductButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return
    
    setIsDeleting(true)
    await deleteProduct(id)
    setIsDeleting(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-600 transition-colors"
      title="Delete Product"
    >
      {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
    </button>
  )
}