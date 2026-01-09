// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl

  // 1. Skip internal Next.js files and images
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.includes('.') || 
    url.pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // 2. Identify if this is a storefront request
  // Locally, if the host is NOT exactly 'localhost:3000', it's a store.
  const isStore = hostname !== 'localhost:3000' && hostname !== '127.0.0.1:3000'

  if (isStore) {
    console.log(`🎯 Storefront Detected: ${hostname}. Rewriting to /${hostname}${url.pathname}`)
    return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, request.url))
  }

  // 3. Standard Dashboard Protection for the main domain
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (url.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}