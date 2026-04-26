import { PostCard } from './PostCard'

interface Post {
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
}

interface PostGridProps {
  posts: Post[]
  /**
   * Si es true, el primer post se muestra como tarjeta featured (ancho completo)
   * y el resto en grid de 3 columnas.
   */
  withFeatured?: boolean
}

export function PostGrid({ posts, withFeatured = false }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg
          aria-hidden="true"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--color-border)' }}
          className="mb-4"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="9" y1="15" x2="15" y2="15" />
          <line x1="9" y1="11" x2="11" y2="11" />
        </svg>
        <p className="text-lg font-medium" style={{ color: '#374151' }}>
          No hay artículos publicados aún
        </p>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
          Vuelve pronto para leer las últimas historias del Bajo Sinú.
        </p>
      </div>
    )
  }

  if (withFeatured && posts.length >= 1) {
    const [featured, ...rest] = posts
    return (
      <div>
        {/* Featured post — ancho completo */}
        <div className="mb-10">
          <PostCard {...featured} featured />
        </div>

        {/* Grid 3 columnas del resto */}
        {rest.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {rest.map((post) => (
              <li key={post.id} className="flex">
                <PostCard {...post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
      {posts.map((post) => (
        <li key={post.id} className="flex">
          <PostCard {...post} />
        </li>
      ))}
    </ul>
  )
}
