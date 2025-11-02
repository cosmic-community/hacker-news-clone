'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="bg-white border border-gray-300 rounded p-8 text-center">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-hn-gray mb-4">
        We encountered an error while loading this content.
      </p>
      <button
        onClick={reset}
        className="hn-button"
      >
        Try again
      </button>
    </div>
  )
}