import Link from 'next/link'

interface NavItem {
  label: string
  href: string
  color?: string | null
}

interface NavigationProps {
  items: NavItem[]
  /** Variante visual: 'horizontal' para header desktop, 'vertical' para mobile menu */
  variant?: 'horizontal' | 'vertical'
  onItemClick?: () => void
}

export function Navigation({ items, variant = 'horizontal', onItemClick }: NavigationProps) {
  if (variant === 'vertical') {
    return (
      <ul role="list" className="flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onItemClick}
              className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors hover:bg-gray-50"
              style={{ color: '#1F2937' }}
            >
              {item.color && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
              )}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul role="list" className="flex items-center gap-1">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: '#374151' }}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
