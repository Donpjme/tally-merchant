import React from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <span className="text-lg font-bold tracking-tight">Tally Merchant</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <NavItem active icon={<HomeIcon className="h-4 w-4" />}>Dashboard</NavItem>
          <NavItem icon={<ShoppingBagIcon className="h-4 w-4" />}>Orders</NavItem>
          <NavItem icon={<PackageIcon className="h-4 w-4" />}>Products</NavItem>
          <NavItem icon={<UsersIcon className="h-4 w-4" />}>Customers</NavItem>
          <NavItem icon={<BarChartIcon className="h-4 w-4" />}>Analytics</NavItem>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function NavItem({ children, active, icon }: { children: React.ReactNode; active?: boolean; icon?: React.ReactNode }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-foreground text-background'
          : 'text-foreground/70 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

// --- Icons ---

function HomeIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  );
}

function ShoppingBagIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  );
}

function PackageIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-10"/></svg>
  );
}

function UsersIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

function BarChartIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
  );
}