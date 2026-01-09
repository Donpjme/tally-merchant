'use client'

import { updateStore } from '@/app/actions'
import { type Store } from '@/app/index'
import { Loader2, Save } from 'lucide-react'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
    >
      {pending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
      Save Changes
    </button>
  )
}

export default function SettingsForm({ store }: { store: Store }) {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function clientAction(formData: FormData) {
    setMessage(null)
    const result = await updateStore(formData)
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Store settings updated successfully.' })
    }
  }

  return (
    <form action={clientAction} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Store Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            defaultValue={store.name}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="e.g. 2348012345678"
            defaultValue={store.phone || ''}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">Include country code without +. Required for WhatsApp checkout.</p>
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-slate-700">
            Currency
          </label>
          <select
            name="currency"
            id="currency"
            defaultValue={store.currency}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="NGN">Nigerian Naira (NGN)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-700">
            Store URL
          </label>
          <div className="mt-1 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 sm:text-sm">
             {store.slug}.tally.ng
          </div>
          <p className="mt-1 text-xs text-slate-500">Subdomains cannot be changed after creation.</p>
        </div>
      </div>

      {message && (
        <div className={`rounded-md p-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}