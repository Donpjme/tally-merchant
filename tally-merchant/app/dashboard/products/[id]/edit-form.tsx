'use client'

import { updateProduct } from '@/app/actions'
import { type Product } from '@/app/index'
import { ArrowLeft, Loader2, Save, UploadCloud } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { GenerateAIDescriptionButton } from '../generate-ai-button'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
    >
      {pending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
      Save Changes
    </button>
  )
}

export default function EditProductForm({ product }: { product: Product }) {
  const [error, setError] = useState<string | null>(null)
  const [productName, setProductName] = useState(product.name)
  const [description, setDescription] = useState(product.description || '')
  
  const updateProductWithId = updateProduct.bind(null, product.id)

  async function clientAction(formData: FormData) {
    const result = await updateProductWithId(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
      </div>

      <form action={clientAction} className="space-y-8">
        {/* Card: Basic Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <GenerateAIDescriptionButton productName={productName} onDescriptionGenerated={setDescription} />
              </div>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-slate-700">
                Product Image
              </label>
              {product.images && product.images.length > 0 && (
                 <div className="mb-4 mt-2">
                    <Image 
                      src={product.images[0]} 
                      alt="Current" 
                      width={128} 
                      height={128} 
                      className="h-32 w-32 rounded-lg object-cover border border-slate-200" 
                    />
                 </div>
              )}
              <div className="mt-1 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-slate-300" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a new file</span>
                      <input id="image" name="image" type="file" accept="image/*" className="sr-only" />
                    </label>
                    <p className="pl-1">to replace current image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Pricing */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Pricing</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                Price (₦)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                defaultValue={product.price}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="compare_at_price" className="block text-sm font-medium text-slate-700">
                Compare at Price
              </label>
              <input
                type="number"
                name="compare_at_price"
                id="compare_at_price"
                min="0"
                step="0.01"
                defaultValue={product.compare_at_price || ''}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
             <div>
              <label htmlFor="cost_per_item" className="block text-sm font-medium text-slate-700">
                Cost per Item
              </label>
              <input
                type="number"
                name="cost_per_item"
                id="cost_per_item"
                min="0"
                step="0.01"
                defaultValue={product.cost_per_item || ''}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Card: Inventory */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Inventory</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-slate-700">Stock</label>
              <input type="number" name="stock" id="stock" defaultValue={product.stock} min="0" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
              <input type="text" name="category" id="category" defaultValue={product.category || ''} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
             <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                id="status"
                defaultValue={product.status}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}
