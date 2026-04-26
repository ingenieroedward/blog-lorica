'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

type Post = {
  id: number
  title: string
  slug: string
  published: boolean
  createdAt: Date
  category: { name: string; color: string | null }
}

export function PostsTable({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [deleting, setDeleting] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!window.confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      setPosts((prev) => prev.filter((p) => p.id !== id))
      router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: '#F9FAFB' }}>
            <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: '#6B7280' }}>Título</th>
            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide hidden sm:table-cell" style={{ color: '#6B7280' }}>Categoría</th>
            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide hidden md:table-cell" style={{ color: '#6B7280' }}>Estado</th>
            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide hidden lg:table-cell" style={{ color: '#6B7280' }}>Fecha</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--color-border)' }}>
              <td className="px-5 py-3.5">
                <p className="font-medium truncate max-w-xs" style={{ color: '#111827' }}>{post.title}</p>
                <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: '#9CA3AF' }}>/blog/{post.slug}</p>
              </td>
              <td className="px-4 py-3.5 hidden sm:table-cell">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: post.category.color ? `${post.category.color}20` : '#F3F4F6',
                    color:           post.category.color ?? '#6B7280',
                  }}
                >
                  {post.category.name}
                </span>
              </td>
              <td className="px-4 py-3.5 hidden md:table-cell">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: post.published ? '#D1FAE5' : '#F3F4F6',
                    color:           post.published ? '#065F46' : '#6B7280',
                  }}
                >
                  {post.published ? 'Publicado' : 'Borrador'}
                </span>
              </td>
              <td className="px-4 py-3.5 text-xs hidden lg:table-cell" style={{ color: '#9CA3AF' }}>
                {formatDate(post.createdAt)}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3 justify-end">
                  {post.published && (
                    <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs hover:underline" style={{ color: '#9CA3AF' }}>
                      Ver ↗
                    </Link>
                  )}
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-xs font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="text-xs text-red-500 hover:underline disabled:opacity-50"
                  >
                    {deleting === post.id ? '…' : 'Borrar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: '#9CA3AF' }}>
                No hay artículos.{' '}
                <Link href="/admin/posts/new" className="underline" style={{ color: 'var(--color-primary)' }}>
                  Crea el primero
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
