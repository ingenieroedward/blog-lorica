import { adminGetTags } from '@/lib/admin/tags'
import { TagsClient } from '@/components/admin/TagsClient'

export const dynamic = 'force-dynamic'

export default async function AdminTagsPage() {
  const tags = await adminGetTags()
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Tags</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{tags.length} tags</p>
      </div>
      <TagsClient initialTags={tags.map((t) => ({
        id: t.id, name: t.name, slug: t.slug,
        postCount: (t as { postTags: unknown[] }).postTags?.length ?? 0,
      }))} />
    </div>
  )
}
