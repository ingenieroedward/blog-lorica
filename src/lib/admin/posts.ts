import { db } from '@/db'
import { posts, postTags, tags } from '@/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { generateSlug, calculateReadingTime } from '@/lib/utils'

export type PostRow = {
  id: number
  title: string
  slug: string
  excerpt: string
  published: boolean
  publishedAt: Date | null
  readingTime: number | null
  createdAt: Date
  updatedAt: Date
  category: { id: number; name: string; slug: string; color: string | null }
  author: { id: number; name: string }
}

export async function adminGetPosts(): Promise<PostRow[]> {
  return db.query.posts.findMany({
    orderBy: [desc(posts.createdAt)],
    with: {
      category: { columns: { id: true, name: true, slug: true, color: true } },
      author:   { columns: { id: true, name: true } },
    },
  }) as Promise<PostRow[]>
}

export async function adminGetPost(id: number) {
  return db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      category:  { columns: { id: true, name: true, slug: true, color: true } },
      author:    { columns: { id: true, name: true } },
      postTags:  { with: { tag: true } },
    },
  })
}

export type CreatePostInput = {
  title: string
  slug?: string
  content: string
  excerpt: string
  coverImage?: string
  coverImageAlt?: string
  metaTitle?: string
  metaDesc?: string
  canonicalUrl?: string
  published?: boolean
  authorId: number
  categoryId: number
  tagIds?: number[]
}

export async function adminCreatePost(input: CreatePostInput) {
  const slug = input.slug || generateSlug(input.title)
  const readingTime = calculateReadingTime(input.content)
  const now = new Date()

  const [post] = await db.insert(posts).values({
    title:         input.title,
    slug,
    content:       input.content,
    excerpt:       input.excerpt,
    coverImage:    input.coverImage,
    coverImageAlt: input.coverImageAlt,
    metaTitle:     input.metaTitle,
    metaDesc:      input.metaDesc,
    canonicalUrl:  input.canonicalUrl,
    published:     input.published ?? false,
    publishedAt:   input.published ? now : null,
    readingTime,
    authorId:      input.authorId,
    categoryId:    input.categoryId,
    updatedAt:     now,
  }).returning()

  if (input.tagIds?.length) {
    await db.insert(postTags).values(
      input.tagIds.map((tagId) => ({ postId: post.id, tagId }))
    )
  }

  return post
}

export type UpdatePostInput = Partial<CreatePostInput> & { id: number }

export async function adminUpdatePost(input: UpdatePostInput) {
  const { id, tagIds, ...data } = input

  const existing = await db.query.posts.findFirst({ where: eq(posts.id, id) })
  if (!existing) throw new Error('Post no encontrado')

  const readingTime = data.content ? calculateReadingTime(data.content) : existing.readingTime
  const slug = data.slug || (data.title ? generateSlug(data.title) : existing.slug)

  // If publishing for first time
  const publishedAt =
    data.published && !existing.published ? new Date()
    : data.published === false ? null
    : existing.publishedAt

  const [updated] = await db.update(posts)
    .set({
      ...data,
      slug,
      readingTime,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning()

  if (tagIds !== undefined) {
    await db.delete(postTags).where(eq(postTags.postId, id))
    if (tagIds.length) {
      await db.insert(postTags).values(tagIds.map((tagId) => ({ postId: id, tagId })))
    }
  }

  return updated
}

export async function adminDeletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id))
}

export async function adminGetStats() {
  const [total, published, cats, authors] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(posts),
    db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.published, true)),
    db.execute(sql`SELECT count(*) FROM categories`),
    db.execute(sql`SELECT count(*) FROM authors`),
  ])
  return {
    totalPosts:     Number(total[0].count),
    publishedPosts: Number(published[0].count),
    categories:     Number((cats.rows[0] as { count: string }).count),
    authors:        Number((authors.rows[0] as { count: string }).count),
  }
}
