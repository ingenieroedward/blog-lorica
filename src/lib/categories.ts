import { db } from '@/db'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.name)
}

export async function getCategoryBySlug(slug: string) {
  const [result] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)
  return result ?? null
}

export async function getAllCategorySlugs() {
  return db.select({ slug: categories.slug }).from(categories)
}
