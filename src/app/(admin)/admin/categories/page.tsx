import { adminGetCategories } from '@/lib/admin/categories'
import { CategoriesClient } from '@/components/admin/CategoriesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await adminGetCategories()
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Categorías</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{categories.length} categorías</p>
      </div>
      <CategoriesClient initialCategories={categories.map((c) => ({
        id: c.id, name: c.name, slug: c.slug,
        description: c.description ?? '',
        color: c.color ?? '#6B7280',
        postCount: (c as { posts: unknown[] }).posts?.length ?? 0,
      }))} />
    </div>
  )
}
