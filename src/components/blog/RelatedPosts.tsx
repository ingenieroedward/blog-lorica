import Link from 'next/link'

interface RelatedPost {
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  publishedAt: Date | null
  categoryName: string
  categorySlug: string
  categoryColor: string | null
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <aside aria-label="Artículos relacionados">
      <h2
        className="text-base font-bold uppercase tracking-wider mb-4 pb-3 border-b"
        style={{ color: 'var(--color-primary)', borderColor: 'var(--color-border)' }}
      >
        Artículos relacionados
      </h2>
      <ul className="space-y-5" role="list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex gap-3"
              aria-label={post.title}
            >
              {post.coverImage && (
                <div className="w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: post.categoryColor ?? 'var(--color-primary)' }}
                >
                  {post.categoryName}
                </span>
                <p
                  className="text-sm font-semibold leading-snug line-clamp-2 mt-0.5 transition-colors group-hover:text-[var(--color-primary)]"
                  style={{ color: '#1F2937' }}
                >
                  {post.title}
                </p>
                {post.publishedAt && (
                  <time
                    className="text-xs mt-1 block"
                    style={{ color: 'var(--color-muted)' }}
                    dateTime={post.publishedAt.toISOString()}
                  >
                    {new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(post.publishedAt)}
                  </time>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
