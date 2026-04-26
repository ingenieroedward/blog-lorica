import { db } from '@/db'
import { tags } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'

export async function adminGetTags() {
  return db.query.tags.findMany({
    orderBy: (t, { asc }) => [asc(t.name)],
    with: { postTags: { columns: { postId: true } } },
  })
}

export async function adminCreateTag(input: { name: string; slug?: string }) {
  const slug = input.slug || generateSlug(input.name)
  const [tag] = await db.insert(tags).values({ name: input.name, slug }).returning()
  return tag
}

export async function adminUpdateTag(id: number, input: { name?: string; slug?: string }) {
  const slug = input.slug || (input.name ? generateSlug(input.name) : undefined)
  const [tag] = await db.update(tags)
    .set({ ...input, ...(slug ? { slug } : {}) })
    .where(eq(tags.id, id))
    .returning()
  return tag
}

export async function adminDeleteTag(id: number) {
  await db.delete(tags).where(eq(tags.id, id))
}
