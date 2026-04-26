import { db } from '@/db'
import { posts, authors, categories } from '@/db/schema'
import { eq, and, desc, ne } from 'drizzle-orm'
import { POSTS_PER_PAGE } from './constants'

export async function getPosts({
  page = 1,
  limit = POSTS_PER_PAGE,
  categorySlug,
}: { page?: number; limit?: number; categorySlug?: string } = {}) {
  const offset = (page - 1) * limit

  const rows = await db
    .select({
      id:            posts.id,
      title:         posts.title,
      slug:          posts.slug,
      excerpt:       posts.excerpt,
      coverImage:    posts.coverImage,
      coverImageAlt: posts.coverImageAlt,
      publishedAt:   posts.publishedAt,
      readingTime:   posts.readingTime,
      authorName:    authors.name,
      authorSlug:    authors.slug,
      authorImage:   authors.image,
      categoryName:  categories.name,
      categorySlug:  categories.slug,
      categoryColor: categories.color,
    })
    .from(posts)
    .innerJoin(authors,    eq(posts.authorId,   authors.id))
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .where(
      categorySlug
        ? and(eq(posts.published, true), eq(categories.slug, categorySlug))
        : eq(posts.published, true),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset)

  return rows.map((r) => ({
    id:          r.id,
    title:       r.title,
    slug:        r.slug,
    excerpt:     r.excerpt,
    coverImage:  r.coverImage,
    coverImageAlt: r.coverImageAlt,
    publishedAt: r.publishedAt,
    readingTime: r.readingTime,
    author:   { name: r.authorName,   slug: r.authorSlug,   image: r.authorImage },
    category: { name: r.categoryName, slug: r.categorySlug, color: r.categoryColor },
  }))
}

export async function getPostBySlug(slug: string) {
  const result = await db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), eq(posts.published, true)),
    with: {
      author:   true,
      category: true,
      postTags: { with: { tag: true } },
    },
  })
  if (!result) return null

  return {
    ...result,
    tags: result.postTags.map((pt) => pt.tag),
  }
}

export async function getAllPostSlugs() {
  return db
    .select({ slug: posts.slug, updatedAt: posts.updatedAt })
    .from(posts)
    .where(eq(posts.published, true))
}

export async function getRelatedPosts(postId: number, categoryId: number, limit = 3) {
  return db
    .select({
      title:        posts.title,
      slug:         posts.slug,
      excerpt:      posts.excerpt,
      coverImage:   posts.coverImage,
      publishedAt:  posts.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryColor: categories.color,
    })
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .where(
      and(
        eq(posts.published, true),
        eq(posts.categoryId, categoryId),
        ne(posts.id, postId),
      ),
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
}
