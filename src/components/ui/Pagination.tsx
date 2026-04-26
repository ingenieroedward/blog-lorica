import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const prevHref = currentPage > 1
    ? currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`
    : null

  const nextHref = currentPage < totalPages
    ? `${basePath}?page=${currentPage + 1}`
    : null

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-4 mt-16"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all hover:shadow-sm"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-primary)',
            backgroundColor: 'white',
          }}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Anterior
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border opacity-40 cursor-not-allowed"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Anterior
        </span>
      )}

      <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
        Página <strong style={{ color: '#374151' }}>{currentPage}</strong> de{' '}
        <strong style={{ color: '#374151' }}>{totalPages}</strong>
      </span>

      {nextHref ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all hover:shadow-sm"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-primary)',
            backgroundColor: 'white',
          }}
        >
          Siguiente
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border opacity-40 cursor-not-allowed"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
          Siguiente
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      )}
    </nav>
  )
}
