import { db } from '@/db'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'

export async function adminGetCategories() {
  return db.query.categories.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
    with: { posts: { columns: { id: true } } },
  })
}

export async function adminCreateCategory(input: {
  name: string
  slug?: string
  description?: string
  color?: string
  metaTitle?: string
  metaDesc?: string
}) {
  const slug = input.slug || generateSlug(input.name)
  const [cat] = await db.insert(categories).values({ ...input, slug }).returning()
  return cat
}

export async function adminUpdateCategory(id: number, input: {
  name?: string
  slug?: string
  description?: string
  color?: string
  metaTitle?: string
  metaDesc?: string
}) {
  const slug = input.slug || (input.name ? generateSlug(input.name) : undefined)
  const [cat] = await db.update(categories)
    .set({ ...input, ...(slug ? { slug } : {}) })
    .where(eq(categories.id, id))
    .returning()
  return cat
}

export async function adminDeleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id))
}
