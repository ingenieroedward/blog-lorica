import type { Metadata } from 'next'
import { getPosts } from '@/lib/posts'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants'
import { JsonLd } from '@/components/seo/JsonLd'
import { PostGrid } from '@/components/blog/PostGrid'
import { AdSlot } from '@/components/ads/AdSlot'

export const metadata: Metadata = {
  title: `Blog — ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog` },
}

export const revalidate = 3600

export default async function BlogPage() {
  const posts = await getPosts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Blog | ${SITE_NAME}`,
    url: `${SITE_URL}/blog`,
    description: SITE_DESCRIPTION,
  }

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero de la sección */}
      <section
        className="py-12 md:py-16 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--color-accent)' }}
          >
            Todas las historias
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#111827' }}
          >
            El Blog
          </h1>
          <p className="text-base md:text-lg max-w-2xl" style={{ color: 'var(--color-muted)' }}>
            {SITE_DESCRIPTION}
          </p>
        </div>
      </section>

      {/* Header ad */}
      <AdSlot position="HEADER" label className="max-w-6xl mx-auto px-4 sm:px-6 pt-6" />

      {/* Grid de artículos */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <PostGrid posts={posts} />
      </section>
    </>
  )
}
