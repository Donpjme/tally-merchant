import Link from 'next/link'
import { ArrowRight, Zap, Smartphone, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              T
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Tally.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
              The Commerce OS for Africa
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Sell everywhere. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Manage in one place.
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto">
              Launch your online store in seconds. Manage inventory, orders, and customers from a single dashboard. No coding required.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all"
              >
                Start Selling for Free
                <ArrowRight size={20} />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                View Demo
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-400">No credit card required • 14-day free trial</p>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-indigo-50 blur-3xl opacity-50 pointer-events-none" />
      </section>

      {/* ─── FEATURE GRID ─── */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={<Globe className="text-blue-600" />}
              title="Free Online Store"
              desc="Get a professional website (yourname.tally.ng) that looks great on mobile and loads instantly."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-500" />}
              title="AI Product Writer"
              desc="Upload a photo, and our AI writes the description for you. SEO-ready in seconds."
            />
            <FeatureCard 
              icon={<Smartphone className="text-green-600" />}
              title="WhatsApp Integration"
              desc="Receive orders directly on WhatsApp. Close deals faster where your customers already are."
            />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Tally Inc. Built for ambitious merchants.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}