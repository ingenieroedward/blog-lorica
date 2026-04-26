'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-col items-center justify-center min-h-dvh gap-4 text-center px-4">
      <p className="text-6xl font-bold" style={{ color: 'var(--color-accent)' }}>500</p>
      <h1 className="text-2xl font-semibold text-gray-800">Algo salió mal</h1>
      <p className="text-gray-500 max-w-sm">
        Ocurrió un error inesperado. Por favor intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="mt-2 px-6 py-2 rounded-full text-white font-medium"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Intentar de nuevo
      </button>
    </main>
  )
}
