import Link from 'next/link'
import { adminGetPosts } from '@/lib/admin/posts'
import { PostsTable } from '@/components/admin/PostsTable'

export const dynamic = 'force-dynamic'

export default async function AdminPostsPage() {
  const posts = await adminGetPosts()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Artículos</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{posts.length} artículos en total</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          + Nuevo artículo
        </Link>
      </div>

      <PostsTable initialPosts={posts as Parameters<typeof PostsTable>[0]['initialPosts']} />
    </div>
  )
}
