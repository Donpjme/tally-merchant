import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CartProvider } from "@/components/cart-provider";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string }>
}) {
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
    .select('name, currency')
    .eq('slug', subdomain)
    .single()

  if (!store) return notFound()

  return (
    <CartProvider>
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
              {store.name}
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/cart" className="group flex items-center gap-2 p-2">
                <div className="relative">
                  <ShoppingBag className="h-6 w-6 text-slate-600 group-hover:text-indigo-600" />
                  {/* The Cart Badge */}
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    0
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-slate-100 bg-slate-50 py-12">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} {store.name}. Powered by Tally.
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}