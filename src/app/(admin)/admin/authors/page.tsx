import { adminGetAuthors } from '@/lib/admin/authors'
import { AuthorsClient } from '@/components/admin/AuthorsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAuthorsPage() {
  const authors = await adminGetAuthors()
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Autores</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{authors.length} autores</p>
      </div>
      <AuthorsClient initialAuthors={authors.map((a) => ({
        id: a.id, name: a.name, slug: a.slug,
        bio: a.bio, shortBio: a.shortBio,
        email: a.email ?? '', image: a.image ?? '',
        twitter: a.twitter ?? '', instagram: a.instagram ?? '',
        postCount: (a as { posts: unknown[] }).posts?.length ?? 0,
      }))} />
    </div>
  )
}
