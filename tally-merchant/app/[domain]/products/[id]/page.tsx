import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AddToCartButton } from './add-to-cart'
import { type Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ domain: string; slug: string }> }): Promise<Metadata> {
  const { domain, slug } = await params
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

  const { data: store } = await supabase
    .from('stores')
    .select('id, name')
    .eq('slug', domain)
    .single()

  if (!store) return { title: 'Product Not Found' }

  const { data: product } = await supabase
    .from('products')
    .select('name, description, images')
    .eq('slug', slug)
    .eq('store_id', store.id)
    .single()

  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.name} | ${store.name}`,
    description: product.description || `Buy ${product.name} at ${store.name}`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at ${store.name}`,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ domain: string; slug: string }> }) {
  const { domain, slug } = await params
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

  // 1. Get Store
  const { data: store } = await supabase
    .from('stores')
    .select('id, name')
    .eq('slug', domain)
    .single()

  if (!store) return notFound()

  // 2. Get Product by Slug
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('store_id', store.id)
    .single()

  if (!product) return notFound()

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product Image */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product.price)}
            </p>
            {product.compare_at_price && (
               <p className="text-lg text-gray-500 line-through">
                 {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product.compare_at_price)}
               </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-10">
             <AddToCartButton storeId={store.id} productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  )
}