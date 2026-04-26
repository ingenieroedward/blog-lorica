'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { href: '/admin',            label: 'Dashboard',       icon: '◈' },
  { href: '/admin/posts',      label: 'Artículos',       icon: '✦' },
  { href: '/admin/posts/new',  label: 'Nuevo artículo',  icon: '+' },
  { href: '/admin/categories', label: 'Categorías',      icon: '◉' },
  { href: '/admin/tags',       label: 'Tags',            icon: '#' },
  { href: '/admin/authors',    label: 'Autores',         icon: '◎' },
  { href: '/admin/ads',        label: 'Anuncios',        icon: '$' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside
      className="w-56 shrink-0 flex flex-col h-screen sticky top-0"
      style={{ backgroundColor: '#111827', color: 'white' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#1F2937' }}>
        <Link href="/" target="_blank" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            BS
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Bajo Sinú</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ href, label, icon }) => {
          const isActive =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                color:           isActive ? 'white' : '#9CA3AF',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
              }}
            >
              <span className="text-base leading-none" aria-hidden>{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: '#1F2937' }}>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors hover:bg-white/10"
          style={{ color: '#9CA3AF' }}
        >
          <span aria-hidden>↗</span> Ver sitio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10 text-left"
          style={{ color: '#9CA3AF' }}
        >
          <span aria-hidden>→</span> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
