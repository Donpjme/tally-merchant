'use client'

import { addProduct } from '@/app/actions'
import { ArrowLeft, Loader2, Save, UploadCloud, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
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
      Save Product
    </button>
  )
}

function generateVariants(options: { name: string; values: string }[]) {
  const validOptions = options.filter(o => o.name && o.values)
  if (validOptions.length === 0) return []

  const generateCombinations = (index: number, currentOptions: Record<string, string>, currentName: string[]): { name: string; price: number; stock: number; options: Record<string, string> }[] => {
    if (index === validOptions.length) {
      return [{
        name: currentName.join(' / '),
        price: 0,
        stock: 0,
        options: currentOptions
      }]
    }

    const option = validOptions[index]
    const values = option.values.split(',').map(v => v.trim()).filter(v => v !== '')
    
    if (values.length === 0) return []

    let combinations: { name: string; price: number; stock: number; options: Record<string, string> }[] = []
    for (const value of values) {
      combinations = [
        ...combinations,
        ...generateCombinations(
          index + 1, 
          { ...currentOptions, [option.name]: value }, 
          [...currentName, value]
        )
      ]
    }
    return combinations
  }

  return generateCombinations(0, {}, [])
}

export default function AddProductPage() {
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  
  // Variants State
  const [hasVariants, setHasVariants] = useState(false)
  const [options, setOptions] = useState<{ name: string; values: string }[]>([
    { name: 'Size', values: '' },
  ])
  const [variants, setVariants] = useState<{ name: string; price: number; stock: number; options: Record<string, string> }[]>([])

  const handleOptionsChange = (newOptions: { name: string; values: string }[]) => {
    setOptions(newOptions)
    if (hasVariants) {
      setVariants(generateVariants(newOptions))
    }
  }

  async function clientAction(formData: FormData) {
    const result = await addProduct(formData)
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
        <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
      </div>

      <form action={clientAction} className="space-y-8">
        {/* Hidden input for variants data */}
        <input type="hidden" name="variants" value={JSON.stringify(variants)} />

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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vintage Cotton T-Shirt"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <GenerateAIDescriptionButton productName={name} onDescriptionGenerated={setDescription} />
              </div>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-slate-700">
                Product Image
              </label>
              <div className="mt-1 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-slate-300" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="image" name="image" type="file" accept="image/*" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF up to 5MB</p>
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
                placeholder="0.00"
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
                placeholder="0.00"
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
                placeholder="0.00"
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
              <input type="number" name="stock" id="stock" defaultValue={0} min="0" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* Card: Variants */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Variants</h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasVariants"
                checked={hasVariants}
                onChange={(e) => {
                  setHasVariants(e.target.checked)
                  if (e.target.checked) {
                    setVariants(generateVariants(options))
                  } else {
                    setVariants([])
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="hasVariants" className="text-sm text-slate-700">
                This product has options (e.g. size, color)
              </label>
            </div>
          </div>

          {hasVariants && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Options</label>
                {options.map((option, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Option Name (e.g. Size)"
                      value={option.name}
                      onChange={(e) => {
                        const newOptions = [...options]
                        newOptions[idx].name = e.target.value
                        handleOptionsChange(newOptions)
                      }}
                      className="block w-1/3 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Values (comma separated, e.g. S, M, L)"
                      value={option.values}
                      onChange={(e) => {
                        const newOptions = [...options]
                        newOptions[idx].values = e.target.value
                        handleOptionsChange(newOptions)
                      }}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = options.filter((_, i) => i !== idx)
                        handleOptionsChange(newOptions)
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleOptionsChange([...options, { name: '', values: '' }])}
                  className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <Plus size={16} /> Add another option
                </button>
              </div>

              {variants.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Variant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {variants.map((variant, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{variant.name}</td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              placeholder="0.00"
                              value={variant.price || ''}
                              onChange={(e) => {
                                const newVariants = [...variants]
                                newVariants[idx].price = parseFloat(e.target.value)
                                setVariants(newVariants)
                              }}
                              className="block w-24 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={variant.stock || ''}
                              onChange={(e) => {
                                const newVariants = [...variants]
                                newVariants[idx].stock = parseInt(e.target.value)
                                setVariants(newVariants)
                              }}
                              className="block w-24 rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card: Organization */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Organization</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
              <input type="text" name="category" id="category" placeholder="e.g. Fashion" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                id="status"
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
