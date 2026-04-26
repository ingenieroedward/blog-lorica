import Link from 'next/link'

interface CategoryBadgeProps {
  name: string
  slug: string
  color?: string | null
  /** Si es true renderiza como <span> sin enlace */
  static?: boolean
}

export function CategoryBadge({ name, slug, color, static: isStatic }: CategoryBadgeProps) {
  const bg = color ?? 'var(--color-primary)'

  const inner = (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-white transition-opacity"
      style={{ backgroundColor: bg }}
    >
      {name}
    </span>
  )

  if (isStatic) return inner

  return (
    <Link
      href={`/categoria/${slug}`}
      className="hover:opacity-80 transition-opacity"
      aria-label={`Ver artículos de la categoría ${name}`}
    >
      {inner}
    </Link>
  )
}
