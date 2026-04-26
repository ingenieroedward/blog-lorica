import Link from 'next/link'
import { getPosts } from '@/lib/posts'
import { getCategories } from '@/lib/categories'
import { PostGrid } from '@/components/blog/PostGrid'
import { SITE_DESCRIPTION } from '@/lib/constants'

export const revalidate = 3600

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPosts({ limit: 7 }),
    getCategories(),
  ])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
        }}
      >
        {/* Patrón decorativo de olas */}
        <div aria-hidden="true" className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <svg width="100%" height="100%" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200 Q360 100 720 200 Q1080 300 1440 200" stroke="white" strokeWidth="3" fill="none"/>
            <path d="M0 250 Q360 150 720 250 Q1080 350 1440 250" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M0 300 Q360 200 720 300 Q1080 400 1440 300" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
          >
            <span aria-hidden>~</span>
            Lorica, Córdoba, Colombia
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Bajo Sinú
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.85)' }}>
            {SITE_DESCRIPTION}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Leer el blog
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link
              href="#categorias"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:bg-white/20"
              style={{ color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}
            >
              Explorar categorías
            </Link>
          </div>
        </div>
      </section>

      {/* ── Últimos artículos ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ color: '#111827' }}
            >
              Últimas historias
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
              Lo más reciente del Bajo Sinú
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 text-sm font-medium transition-colors hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Ver todos →
          </Link>
        </div>

        <PostGrid posts={posts} withFeatured={posts.length >= 2} />
      </section>

      {/* ── Separador decorativo ─────────────────────────────── */}
      <div aria-hidden="true" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px" style={{ backgroundColor: 'var(--color-border)' }} />
      </div>

      {/* ── Explorar por categoría ───────────────────────────── */}
      {categories.length > 0 && (
        <section id="categorias" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ color: '#111827' }}
            >
              Explorar por categoría
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-muted)' }}>
              Encuentra las historias que más te interesan
            </p>
          </div>

          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            role="list"
          >
            {categories.map((cat) => {
              const color = cat.color ?? 'var(--color-primary)'
              return (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="group flex flex-col items-center text-center p-5 rounded-2xl border bg-white transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{ borderColor: 'var(--color-border)' }}
                    aria-label={`Categoría: ${cat.name}`}
                  >
                    {/* Icono circular con el color de la categoría */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-white text-lg font-bold transition-transform group-hover:scale-110"
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    >
                      {cat.name.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="text-sm font-semibold leading-tight"
                      style={{ color: '#1F2937' }}
                    >
                      {cat.name}
                    </span>
                    {cat.description && (
                      <span
                        className="mt-1 text-xs line-clamp-2 leading-snug"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        {cat.description}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </>
  )
}
