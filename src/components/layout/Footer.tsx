import Link from 'next/link'

interface FooterCategory {
  name: string
  slug: string
}

interface FooterProps {
  categories: FooterCategory[]
}

const currentYear = new Date().getFullYear()

export function Footer({ categories }: FooterProps) {
  return (
    <footer
      className="mt-20 border-t"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'white' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Columna 1: Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4"
              aria-label="Bajo Sinú - Inicio"
            >
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="var(--color-primary)" />
                <path d="M5 16 Q9 10 14 14 Q19 18 23 12" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" fill="none" />
                <path d="M5 20 Q9 14 14 18 Q19 22 23 16" stroke="white" strokeWidth="1.5"
                  strokeLinecap="round" fill="none" opacity="0.6" />
              </svg>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}
              >
                Bajo Sinú
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              La voz moderna del Bajo Sinú. Historias, cultura y vida de Lorica, Córdoba, Colombia.
            </p>
          </div>

          {/* Columna 2: Categorías */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#374151' }}
            >
              Categorías
            </h3>
            <ul className="space-y-2" role="list">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="text-sm transition-colors hover:text-[var(--color-primary)]"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className="text-sm font-medium transition-colors hover:text-[var(--color-primary)]"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Ver todos los artículos →
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: El blog */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#374151' }}
            >
              El blog
            </h3>
            <ul className="space-y-2" role="list">
              {[
                { label: 'Sobre nosotros', href: '/sobre-nosotros' },
                { label: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--color-primary)]"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#374151' }}
            >
              Legal
            </h3>
            <ul className="space-y-2" role="list">
              {[
                { label: 'Política de privacidad', href: '/privacidad' },
                { label: 'Términos y condiciones', href: '/terminos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[var(--color-primary)]"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria + copyright */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
        >
          <p>
            &copy; {currentYear} Bajo Sinú &mdash; Lorica, Córdoba, Colombia
          </p>
          <p>
            Hecho con amor por la tierra costeña
          </p>
        </div>
      </div>
    </footer>
  )
}
