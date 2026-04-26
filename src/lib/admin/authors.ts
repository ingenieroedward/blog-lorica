import { db } from '@/db'
import { authors } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'

export async function adminGetAuthors() {
  return db.query.authors.findMany({
    orderBy: (a, { asc }) => [asc(a.name)],
    with: { posts: { columns: { id: true } } },
  })
}

export async function adminGetAuthor(id: number) {
  return db.query.authors.findFirst({ where: eq(authors.id, id) })
}

export async function adminCreateAuthor(input: {
  name: string
  slug?: string
  bio: string
  shortBio: string
  email?: string
  image?: string
  twitter?: string
  instagram?: string
}) {
  const slug = input.slug || generateSlug(input.name)
  const [author] = await db.insert(authors).values({ ...input, slug }).returning()
  return author
}

export async function adminUpdateAuthor(id: number, input: {
  name?: string
  slug?: string
  bio?: string
  shortBio?: string
  email?: string
  image?: string
  twitter?: string
  instagram?: string
}) {
  const slug = input.slug || (input.name ? generateSlug(input.name) : undefined)
  const [author] = await db.update(authors)
    .set({ ...input, ...(slug ? { slug } : {}) })
    .where(eq(authors.id, id))
    .returning()
  return author
}

export async function adminDeleteAuthor(id: number) {
  await db.delete(authors).where(eq(authors.id, id))
}
