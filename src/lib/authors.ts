import { db } from '@/db'
import { authors } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getAuthorBySlug(slug: string) {
  const [result] = await db
    .select()
    .from(authors)
    .where(eq(authors.slug, slug))
    .limit(1)
  return result ?? null
}

export async function getAllAuthorSlugs() {
  return db.select({ slug: authors.slug }).from(authors)
}
