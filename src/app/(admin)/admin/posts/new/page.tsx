import { getCategories } from '@/lib/categories'
import { adminGetAuthors } from '@/lib/admin/authors'
import { adminGetTags } from '@/lib/admin/tags'
import { PostFormClient } from '@/components/admin/PostFormClient'

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  const [categories, authors, tags] = await Promise.all([
    getCategories(),
    adminGetAuthors(),
    adminGetTags(),
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Nuevo artículo</h1>
      </div>
      <PostFormClient
        mode="create"
        categories={categories.map((c) => ({ id: c.id, name: c.name, color: c.color }))}
        authors={authors.map((a) => ({ id: a.id, name: a.name }))}
        allTags={tags.map((t) => ({ id: t.id, name: t.name }))}
      />
    </div>
  )
}
