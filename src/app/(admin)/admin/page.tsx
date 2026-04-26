import Link from 'next/link'
import { adminGetStats } from '@/lib/admin/posts'
import { adminGetPosts } from '@/lib/admin/posts'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [stats, recentPosts] = await Promise.all([
    adminGetStats(),
    adminGetPosts().then((p) => p.slice(0, 5)),
  ])

  const statCards = [
    { label: 'Total artículos',     value: stats.totalPosts,     color: 'var(--color-primary)' },
    { label: 'Publicados',          value: stats.publishedPosts, color: '#10B981' },
    { label: 'Categorías',          value: stats.categories,     color: 'var(--color-accent)' },
    { label: 'Autores',             value: stats.authors,        color: '#8B5CF6' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Resumen del blog Bajo Sinú</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-white border" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-3xl font-bold mb-1" style={{ color }}>{value}</div>
            <div className="text-xs font-medium" style={{ color: '#6B7280' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-10">
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          + Nuevo artículo
        </Link>
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
          style={{ borderColor: 'var(--color-border)', color: '#374151' }}
        >
          Gestionar categorías
        </Link>
      </div>

      {/* Recent posts */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold" style={{ color: '#111827' }}>Artículos recientes</h2>
          <Link href="/admin/posts" className="text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>
            Ver todos →
          </Link>
        </div>
        <ul>
          {recentPosts.map((post) => (
            <li key={post.id} className="px-6 py-3.5 border-b last:border-0 flex items-center gap-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>{post.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                  {(post as { category: { name: string } }).category.name} · {formatDate(post.createdAt)}
                </p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                style={{
                  backgroundColor: post.published ? '#D1FAE5' : '#F3F4F6',
                  color:           post.published ? '#065F46' : '#6B7280',
                }}
              >
                {post.published ? 'Publicado' : 'Borrador'}
              </span>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="text-xs hover:underline shrink-0"
                style={{ color: 'var(--color-primary)' }}
              >
                Editar
              </Link>
            </li>
          ))}
          {recentPosts.length === 0 && (
            <li className="px-6 py-8 text-center text-sm" style={{ color: '#9CA3AF' }}>
              No hay artículos. <Link href="/admin/posts/new" className="underline" style={{ color: 'var(--color-primary)' }}>Crea el primero</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
