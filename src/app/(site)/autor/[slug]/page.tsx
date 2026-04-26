import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getAllAuthorSlugs } from '@/lib/authors'
import { getPosts } from '@/lib/posts'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PostCard } from '@/components/blog/PostCard'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const slugs = await getAllAuthorSlugs()
    return slugs.map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return {}

  const title       = `${author.name} | ${SITE_NAME}`
  const description = author.shortBio
  const url         = `${SITE_URL}/autor/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type:  'profile',
      url,
      title,
      description,
      ...(author.image && { images: [{ url: author.image, width: 400, height: 400 }] }),
    },
  }
}

export const revalidate = 3600

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const [author, posts] = await Promise.all([
    getAuthorBySlug(slug),
    getPosts(),
  ])
  if (!author) notFound()

  const authorPosts = posts.filter((p) => p.author.slug === slug)
  const url = `${SITE_URL}/autor/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id':   `${url}#author`,
        name:    author.name,
        description: author.bio,
        url,
        ...(author.image && { image: author.image }),
        ...(author.twitter  && { sameAs: [`https://twitter.com/${author.twitter}`] }),
        ...(author.instagram && { sameAs: [`https://instagram.com/${author.instagram}`] }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio',      item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: author.name },
        ],
      },
    ],
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Autores', href: '/blog' },
    { label: author.name },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Breadcrumb items={breadcrumbItems} />

        {/* ── Perfil del autor — E-E-A-T ─────────────────────── */}
        <section
          className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-12 border"
          style={{
            borderColor: 'var(--color-border)',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #FAFAF8 100%)',
          }}
          aria-label={`Perfil de ${author.name}`}
        >
          {/* Patrón decorativo */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-48 h-48 opacity-5 pointer-events-none"
          >
            <svg viewBox="0 0 100 100" fill="var(--color-primary)">
              <circle cx="75" cy="25" r="60" />
            </svg>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            {author.image ? (
              <img
                src={author.image}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover shrink-0 ring-4 ring-white shadow-md"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0 ring-4 ring-white shadow-md"
                style={{ backgroundColor: 'var(--color-primary)' }}
                aria-hidden="true"
              >
                {author.name.charAt(0)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: '#111827' }}
              >
                {author.name}
              </h1>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#4B5563' }}>
                {author.bio}
              </p>

              {/* Redes sociales */}
              {(author.twitter || author.instagram) && (
                <div className="flex flex-wrap gap-3">
                  {author.twitter && (
                    <a
                      href={`https://twitter.com/${author.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:shadow-sm"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: '#374151',
                        backgroundColor: 'white',
                      }}
                      aria-label={`Perfil de Twitter de ${author.name}`}
                    >
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.762l7.748-8.857L1.32 2.25H8.1l4.267 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      @{author.twitter}
                    </a>
                  )}
                  {author.instagram && (
                    <a
                      href={`https://instagram.com/${author.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all hover:shadow-sm"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: '#374151',
                        backgroundColor: 'white',
                      }}
                      aria-label={`Perfil de Instagram de ${author.name}`}
                    >
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <circle cx="12" cy="12" r="4"/>
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                      </svg>
                      @{author.instagram}
                    </a>
                  )}
                </div>
              )}

              {/* Conteo de artículos */}
              <p className="mt-4 text-sm" style={{ color: 'var(--color-muted)' }}>
                {authorPosts.length === 0
                  ? 'Sin artículos publicados aún'
                  : `${authorPosts.length} ${authorPosts.length === 1 ? 'artículo publicado' : 'artículos publicados'}`}
              </p>
            </div>
          </div>
        </section>

        {/* ── Grid de artículos del autor ───────────────────── */}
        {authorPosts.length > 0 && (
          <section>
            <h2
              className="text-xl md:text-2xl font-bold mb-8"
              style={{ color: '#111827' }}
            >
              Artículos de {author.name}
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {authorPosts.map((post) => (
                <li key={post.id} className="flex">
                  <PostCard {...post} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
