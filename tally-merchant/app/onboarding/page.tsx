// app/onboarding/page.tsx
'use client' 

import { createStore } from '@/app/actions'
import { Store, ArrowRight, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-70"
    >
      {pending ? <Loader2 className="animate-spin" /> : 'Launch Store'}
      {!pending && <ArrowRight size={18} />}
    </button>
  )
}

export default function OnboardingPage() {
  const [error, setError] = useState<string | null>(null)

  async function clientAction(formData: FormData) {
    const result = await createStore(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Store size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Name your Empire</h2>
          {/* FIX: Escaped apostrophe here */}
          <p className="mt-2 text-gray-600">Let&apos;s set up your free store. You can change this later.</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <form action={clientAction} className="space-y-6">
            
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                name="storeName"
                id="storeName"
                placeholder="e.g. Lagos Sneakers"
                required
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">Your Tally Link</label>
              <div className="mt-2 flex rounded-lg shadow-sm">
                <input
                  type="text"
                  name="subdomain"
                  id="subdomain"
                  placeholder="lagos-sneakers"
                  required
                  className="block w-full min-w-0 flex-1 rounded-none rounded-l-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 px-4 text-gray-500">
                  .tally.ng
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">This is the link you will send to customers.</p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <SubmitButton />
          </form>
        </div>

      </div>
    </div>
  )
}