import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/posts'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { AuthorCard } from '@/components/blog/AuthorCard'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { AdSlot } from '@/components/ads/AdSlot'
import { ArticleWithAds } from '@/components/ads/ArticleWithAds'

type Props = { params: Promise<{ slug: string }> }

// Slugs no pre-generados devuelven 404 real.
// Nuevos artículos se activan vía el webhook /api/revalidate.
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title       = post.metaTitle ?? post.title
  const description = post.metaDesc  ?? post.excerpt
  const url         = `${SITE_URL}/blog/${post.slug}`
  const image       = post.coverImage ?? `${SITE_URL}/opengraph-image`

  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl ?? url },
    openGraph: {
      type:          'article',
      url,
      title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime:  post.updatedAt.toISOString(),
      authors:       [`${SITE_URL}/autor/${post.author.slug}`],
      images: [{ url: image, alt: post.coverImageAlt ?? title, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export const revalidate = 86400

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(post.id, post.categoryId)

  const url = `${SITE_URL}/blog/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':    'Article',
        '@id':      `${url}#article`,
        headline:   post.title,
        description: post.excerpt,
        ...(post.coverImage && {
          image: { '@type': 'ImageObject', url: post.coverImage, width: 1200, height: 630 },
        }),
        datePublished: post.publishedAt?.toISOString(),
        dateModified:  post.updatedAt.toISOString(),
        author: {
          '@type': 'Person',
          '@id':   `${SITE_URL}/autor/${post.author.slug}#author`,
          name:    post.author.name,
          url:     `${SITE_URL}/autor/${post.author.slug}`,
        },
        publisher: {
          '@type': 'Organization',
          '@id':   `${SITE_URL}#organization`,
          name:    SITE_NAME,
          logo:    { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        keywords: post.tags.map((t) => t.name).join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio',               item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: post.category.name,     item: `${SITE_URL}/categoria/${post.category.slug}` },
          { '@type': 'ListItem', position: 3, name: post.title },
        ],
      },
    ],
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: post.category.name, href: `/categoria/${post.category.slug}` },
    { label: post.title },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Layout 2 columnas en desktop */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 xl:gap-16">

          {/* ── Columna principal ─────────────────────────────── */}
          <article>
            {/* Header del artículo */}
            <header className="mb-8">
              <div className="mb-4">
                <CategoryBadge
                  name={post.category.name}
                  slug={post.category.slug}
                  color={post.category.color}
                />
              </div>

              <h1
                className="text-3xl md:text-4xl font-bold leading-tight mb-4"
                style={{ color: '#111827', fontFamily: 'var(--font-serif)' }}
              >
                {post.title}
              </h1>

              <p className="text-lg leading-relaxed mb-6" style={{ color: '#4B5563' }}>
                {post.excerpt}
              </p>

              {/* Meta: autor + fecha + tiempo de lectura */}
              <div
                className="flex flex-wrap items-center gap-4 py-4 border-y text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
              >
                {/* Autor */}
                <a
                  href={`/autor/${post.author.slug}`}
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                  {post.author.image ? (
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                      aria-hidden="true"
                    >
                      {post.author.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium" style={{ color: '#374151' }}>
                    {post.author.name}
                  </span>
                </a>

                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt.toISOString()}
                    className="flex items-center gap-1.5"
                  >
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(post.publishedAt)}
                  </time>
                )}

                {post.readingTime && (
                  <span className="flex items-center gap-1.5">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {post.readingTime} min de lectura
                  </span>
                )}
              </div>
            </header>

            {/* Imagen de portada */}
            {post.coverImage && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-8">
                <img
                  src={post.coverImage}
                  alt={post.coverImageAlt ?? post.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}

            {/* TOC — en mobile aparece aquí, antes del contenido */}
            <div className="lg:hidden">
              <TableOfContents html={post.content} />
            </div>

            {/* Contenido del artículo con ads in-content */}
            <ArticleWithAds content={post.content} className="prose" />

            {/* Tags */}
            {post.tags.length > 0 && (
              <footer className="mt-10 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Etiquetas
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-sm px-3 py-1 rounded-full border"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: '#374151',
                        backgroundColor: 'white',
                      }}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </footer>
            )}

            {/* AuthorCard — E-E-A-T */}
            <AuthorCard
              name={post.author.name}
              slug={post.author.slug}
              bio={post.author.bio}
              shortBio={post.author.shortBio}
              image={post.author.image}
              twitter={post.author.twitter}
              instagram={post.author.instagram}
            />

            {/* Posts relacionados en mobile */}
            {relatedPosts.length > 0 && (
              <div
                className="lg:hidden mt-12 pt-10 border-t"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <RelatedPosts posts={relatedPosts} />
              </div>
            )}
          </article>

          {/* ── Sidebar (solo desktop) ────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">

              {/* Ad sidebar top */}
              <AdSlot position="SIDEBAR_TOP" label className="rounded-xl overflow-hidden" />

              {/* TOC en sidebar */}
              <TableOfContents html={post.content} />

              {/* Posts relacionados */}
              {relatedPosts.length > 0 && (
                <RelatedPosts posts={relatedPosts} />
              )}

              {/* Info de la categoría */}
              {post.category.description && (
                <div
                  className="p-5 rounded-xl border"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'white' }}
                >
                  <div className="mb-3">
                    <CategoryBadge
                      name={post.category.name}
                      slug={post.category.slug}
                      color={post.category.color}
                    />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                    {post.category.description}
                  </p>
                  <a
                    href={`/categoria/${post.category.slug}`}
                    className="mt-3 inline-block text-sm font-medium hover:underline"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Ver todos en {post.category.name} →
                  </a>
                </div>
              )}

              {/* Ad sidebar bottom */}
              <AdSlot position="SIDEBAR_BOTTOM" label className="rounded-xl overflow-hidden" />
            </div>
          </aside>

        </div>
      </div>
    </>
  )
}
