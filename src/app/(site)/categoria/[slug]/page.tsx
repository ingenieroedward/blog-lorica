import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/categories'
import { getPosts } from '@/lib/posts'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PostGrid } from '@/components/blog/PostGrid'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const slugs = await getAllCategorySlugs()
    return slugs.map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}

  const title       = category.metaTitle ?? `${category.name} | ${SITE_NAME}`
  const description = category.metaDesc  ?? category.description ?? ''
  const url         = `${SITE_URL}/categoria/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type:  'website',
      url,
      title,
      description,
      ...(category.image && { images: [{ url: category.image, width: 1200, height: 630 }] }),
    },
  }
}

export const revalidate = 3600

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPosts({ categorySlug: slug }),
  ])
  if (!category) notFound()

  const url = `${SITE_URL}/categoria/${slug}`
  const color = category.color ?? 'var(--color-primary)'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id':   url,
        name:    category.name,
        description: category.description ?? '',
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio',        item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: category.name },
        ],
      },
    ],
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: category.name },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero de la categoría */}
      <section
        className="py-12 md:py-16 border-b"
        style={{
          borderColor: 'var(--color-border)',
          // Fondo tenue derivado del color de la categoría
          backgroundColor: `${color}12`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex items-start gap-5">
            {/* Orbe con inicial de la categoría */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-sm"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            >
              {category.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: '#111827' }}
              >
                {category.name}
              </h1>
              {category.description && (
                <p
                  className="text-base md:text-lg max-w-2xl"
                  style={{ color: '#4B5563' }}
                >
                  {category.description}
                </p>
              )}
              <p className="mt-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                {posts.length === 0
                  ? 'Sin artículos publicados aún'
                  : `${posts.length} ${posts.length === 1 ? 'artículo' : 'artículos'}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de artículos */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <PostGrid posts={posts} />
      </section>
    </>
  )
}
