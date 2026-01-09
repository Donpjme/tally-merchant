// app/dashboard/layout.tsx
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr'; // FIX: Removed unused CookieOptions
import { cookies } from 'next/headers';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, User, BarChart3 } from 'lucide-react';
import React from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Initialize Supabase on the Server
  // FIX: cookies() is now a Promise that must be awaited
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 2. Get User
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Security Check: Does this user own a store?
  if (user) {
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('owner_id', user.id)
      .single();
    
    // If they are logged in but have no store, force them to Onboarding
    if (!store) {
      redirect('/onboarding');
    }
  } else {
    // Redirect to login if no user found
    redirect('/login');
  }

  // 4. Render the Dashboard UI
  return (
    <div className="flex h-screen bg-slate-50">
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 md:flex md:flex-col text-white">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <span className="text-xl font-bold tracking-tight text-white">Tally.</span>
        </div>
        
        <div className="flex flex-1 flex-col gap-1 p-4">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem href="/dashboard/analytics" icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem href="/dashboard/orders" icon={<ShoppingBag size={20} />} label="Orders" />
          <NavItem href="/dashboard/products" icon={<Package size={20} />} label="Products" />
          <NavItem href="/dashboard/customers" icon={<Users size={20} />} label="Customers" />
        </div>

        <div className="border-t border-slate-800 p-4">
          <NavItem href="/dashboard/profile" icon={<User size={20} />} label="Profile" />
          <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
          <form action="/auth/signout" method="post"> 
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors">
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {/* MOBILE HEADER */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 md:hidden">
          <span className="text-xl font-bold text-slate-900">Tally.</span>
          <button className="text-gray-500">Menu</button>
        </header>

        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

// HELPER COMPONENTS
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ href, icon, label, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active 
          ? 'bg-indigo-600 text-white shadow-sm' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}