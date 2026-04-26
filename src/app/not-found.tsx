import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh gap-4 text-center px-4">
      <p className="text-6xl font-bold" style={{ color: 'var(--color-primary)' }}>404</p>
      <h1 className="text-2xl font-semibold text-gray-800">Página no encontrada</h1>
      <p className="text-gray-500 max-w-sm">
        Esta página no existe o fue movida. Regresa al inicio y sigue explorando el Bajo Sinú.
      </p>
      <Link
        href="/"
        className="mt-2 px-6 py-2 rounded-full text-white font-medium"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Volver al inicio
      </Link>
    </main>
  )
}
