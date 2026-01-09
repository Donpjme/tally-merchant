'use client'

import Link from 'next/link'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyPaystackPayment } from '@/app/actions'

export default function OrderConfirmationPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = use(params)
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(reference ? 'loading' : 'success')

  useEffect(() => {
    if (reference) {
      verifyPaystackPayment(reference)
        .then((result) => {
          if (result.success) {
            setStatus('success')
          } else {
            setStatus('error')
          }
        })
        .catch(() => setStatus('error'))
    }
  }, [reference])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        {status === 'loading' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Verifying Payment...
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Please wait while we confirm your transaction.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Order Placed Successfully!
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Thank you for your purchase. We have received your order and will process it shortly.
            </p>
            <div className="mt-8">
              <Link
                href={`/${domain}`}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <XCircle size={32} />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Payment Failed
            </h1>
            <p className="mt-2 text-base text-gray-600">
              We couldn&apos;t verify your payment. Please try again or contact support.
            </p>
            <div className="mt-8">
              <Link
                href={`/${domain}/checkout`}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Try Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}