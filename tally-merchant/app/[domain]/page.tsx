// app/[domain]/page.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Package } from 'lucide-react'

export default async function StorefrontPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params
  const subdomain = domain.split('.')[0].toLowerCase().trim() 

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  const { data: store } = await supabase
    .from('stores')
    .select('id, name, description, currency')
    .eq('slug', subdomain)
    .single()

  if (!store) return notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .eq('status', 'active') 
    .order('created_at', { ascending: false })

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative bg-slate-50 border-b border-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            {store.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
            {store.description || "Welcome to our store. Discover our latest arrivals."}
          </p>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {!products?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={64} className="text-slate-300" />
            <h3 className="mt-4 text-lg font-bold">No products found</h3>
            {/* Linter Fix: We use &apos; here */}
            <p className="text-slate-500">We&apos;re currently updating our shelves.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group">
                <div className="aspect-square relative overflow-hidden rounded-2xl border bg-slate-50">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-200"><Package size={48} /></div>
                  )}
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{p.name}</h3>
                <p className="mt-1 text-lg font-black text-indigo-600">
                  {new Intl.NumberFormat('en-NG', { style: 'currency', currency: store.currency || 'NGN' }).format(p.price)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}