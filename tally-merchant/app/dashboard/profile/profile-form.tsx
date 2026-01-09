'use client'

import { updateProfile } from '@/app/actions'
import { Loader2, Save } from 'lucide-react'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { type User } from '@supabase/supabase-js'

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

export default function ProfileForm({ user }: { user: User }) {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function clientAction(formData: FormData) {
    setMessage(null)
    const result = await updateProfile(formData)
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    }
  }

  return (
    <form action={clientAction} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            disabled
            defaultValue={user.email}
            className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 shadow-sm focus:outline-none sm:text-sm cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-slate-500">Email cannot be changed.</p>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            required
            defaultValue={user.user_metadata?.full_name || ''}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
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