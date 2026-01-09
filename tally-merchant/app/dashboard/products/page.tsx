import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Package, MoreHorizontal } from 'lucide-react'
import { type Product } from '@/app/index'
import { DeleteProductButton } from './delete-button'
import Image from 'next/image'
import { ProductSearch } from './product-search'

export default async function ProductsPage(props: {
  searchParams: Promise<{ query?: string; status?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  // 1. Get Current User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Get User's Store
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!store) redirect('/onboarding')

  // 3. Fetch Products
  let query = supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)

  if (searchParams.query) {
    query = query.ilike('name', `%${searchParams.query}%`)
  }

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }

  const { data: products } = await query.order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <ProductSearch />

      {/* Content */}
      {!products || products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Package size={24} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">No products yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Get started by adding your first product to your inventory.
          </p>
          <Link
            href="/dashboard/products/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Inventory</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] ? (
                          <Image 
                            src={product.images[0]} 
                            alt={product.name} 
                            width={40} 
                            height={40} 
                            className="h-10 w-10 rounded-md object-cover border border-slate-200"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                            <Package size={16} />
                          </div>
                        )}
                        <Link href={`/dashboard/products/${product.id}`} className="hover:text-indigo-600 hover:underline">
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.inventory_count} in stock</td>
                    <td className="px-6 py-4">{product.category || '-'}</td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product.price)}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Link href={`/dashboard/products/${product.id}`} className="text-slate-400 hover:text-indigo-600"><MoreHorizontal size={18} /></Link>
                      <DeleteProductButton id={product.id} />
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