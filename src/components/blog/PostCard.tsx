import Link from 'next/link'
import { CategoryBadge } from '@/components/ui/CategoryBadge'

interface PostCardProps {
  id: number
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  coverImageAlt: string | null
  publishedAt: Date | null
  readingTime: number | null
  author: {
    name: string
    slug: string
    image: string | null
  }
  category: {
    name: string
    slug: string
    color: string | null
  }
  /** Tarjeta grande para el featured post */
  featured?: boolean
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(date)
}

export function PostCard({
  title,
  slug,
  excerpt,
  coverImage,
  coverImageAlt,
  publishedAt,
  readingTime,
  author,
  category,
  featured = false,
}: PostCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${slug}`} className="group block" aria-label={title}>
        <article className="relative overflow-hidden rounded-2xl bg-white border transition-shadow hover:shadow-lg"
          style={{ borderColor: 'var(--color-border)' }}>
          {coverImage && (
            <div className="aspect-[16/9] overflow-hidden bg-gray-100">
              <img
                src={coverImage}
                alt={coverImageAlt ?? title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <div className="p-6 md:p-8">
            <div className="mb-3">
              <CategoryBadge
                name={category.name}
                slug={category.slug}
                color={category.color}
                static
              />
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold leading-snug mb-3 transition-colors"
              style={{ color: '#111827' }}
            >
              <span className="group-hover:underline decoration-[var(--color-primary)] underline-offset-4">
                {title}
              </span>
            </h2>
            <p className="text-base leading-relaxed line-clamp-2 mb-5"
              style={{ color: 'var(--color-muted)' }}>
              {excerpt}
            </p>
            <div className="flex items-center gap-3">
              {author.image ? (
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  aria-hidden="true"
                >
                  {author.name.charAt(0)}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                <span className="font-medium" style={{ color: '#374151' }}>
                  {author.name}
                </span>
                {publishedAt && (
                  <>
                    <span aria-hidden>·</span>
                    <time dateTime={publishedAt.toISOString()}>{formatDate(publishedAt)}</time>
                  </>
                )}
                {readingTime && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{readingTime} min</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${slug}`} className="group block h-full" aria-label={title}>
      <article
        className="flex flex-col h-full overflow-hidden rounded-xl bg-white border transition-shadow hover:shadow-md"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {coverImage && (
          <div className="aspect-video overflow-hidden bg-gray-100 shrink-0">
            <img
              src={coverImage}
              alt={coverImageAlt ?? title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <CategoryBadge
            name={category.name}
            slug={category.slug}
            color={category.color}
            static
          />
          <h2
            className="text-lg font-bold leading-snug line-clamp-3 transition-colors group-hover:text-[var(--color-primary)]"
            style={{ color: '#111827' }}
          >
            {title}
          </h2>
          <p className="text-sm leading-relaxed line-clamp-2 flex-1"
            style={{ color: 'var(--color-muted)' }}>
            {excerpt}
          </p>
          <div className="flex items-center gap-2.5 mt-2 pt-3 border-t"
            style={{ borderColor: 'var(--color-border)' }}>
            {author.image ? (
              <img
                src={author.image}
                alt={author.name}
                className="w-6 h-6 rounded-full object-cover shrink-0"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ backgroundColor: 'var(--color-primary)' }}
                aria-hidden="true"
              >
                {author.name.charAt(0)}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs min-w-0"
              style={{ color: 'var(--color-muted)' }}>
              <span className="font-medium truncate" style={{ color: '#6B7280' }}>
                {author.name}
              </span>
              {publishedAt && (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={publishedAt.toISOString()} className="shrink-0">
                    {formatDate(publishedAt)}
                  </time>
                </>
              )}
              {readingTime && (
                <>
                  <span aria-hidden>·</span>
                  <span className="shrink-0">{readingTime} min</span>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
