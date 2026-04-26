import Link from 'next/link'

interface AuthorCardProps {
  name: string
  slug: string
  bio: string
  shortBio: string
  image?: string | null
  twitter?: string | null
  instagram?: string | null
}

export function AuthorCard({
  name,
  slug,
  bio,
  image,
  twitter,
  instagram,
}: AuthorCardProps) {
  return (
    <aside
      className="flex gap-5 p-6 rounded-2xl border mt-12"
      style={{
        backgroundColor: '#F0F7FF',
        borderColor: '#BFDBFE',
      }}
      aria-label={`Sobre el autor: ${name}`}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0 ring-2 ring-white shadow-sm"
          style={{ backgroundColor: 'var(--color-primary)' }}
          aria-hidden="true"
        >
          {name.charAt(0)}
        </div>
      )}

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1"
          style={{ color: 'var(--color-primary)' }}>
          Sobre el autor
        </p>
        <Link
          href={`/autor/${slug}`}
          className="text-base font-bold hover:underline"
          style={{ color: '#111827' }}
        >
          {name}
        </Link>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: '#4B5563' }}>
          {bio}
        </p>
        {(twitter || instagram) && (
          <div className="flex gap-4 mt-3">
            {twitter && (
              <a
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
                aria-label={`Twitter de ${name}: @${twitter}`}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.762l7.748-8.857L1.32 2.25H8.1l4.267 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @{twitter}
              </a>
            )}
            {instagram && (
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-accent)' }}
                aria-label={`Instagram de ${name}: @${instagram}`}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
                @{instagram}
              </a>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
