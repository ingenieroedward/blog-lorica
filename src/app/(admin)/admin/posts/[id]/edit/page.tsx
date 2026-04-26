import { notFound } from 'next/navigation'
import { adminGetPost } from '@/lib/admin/posts'
import { getCategories } from '@/lib/categories'
import { adminGetAuthors } from '@/lib/admin/authors'
import { adminGetTags } from '@/lib/admin/tags'
import { PostFormClient } from '@/components/admin/PostFormClient'

type Props = { params: Promise<{ id: string }> }

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const [post, categories, authors, tags] = await Promise.all([
    adminGetPost(Number(id)),
    getCategories(),
    adminGetAuthors(),
    adminGetTags(),
  ])

  if (!post) notFound()

  const initialData = {
    title:         post.title,
    slug:          post.slug,
    content:       post.content,
    excerpt:       post.excerpt,
    coverImage:    post.coverImage ?? '',
    coverImageAlt: post.coverImageAlt ?? '',
    metaTitle:     post.metaTitle ?? '',
    metaDesc:      post.metaDesc ?? '',
    published:     post.published,
    authorId:      post.authorId,
    categoryId:    post.categoryId,
    tagIds:        post.postTags.map((pt: { tag: { id: number } }) => pt.tag.id),
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Editar artículo</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{post.title}</p>
      </div>
      <PostFormClient
        mode="edit"
        postId={post.id}
        initialData={initialData}
        categories={categories.map((c) => ({ id: c.id, name: c.name, color: c.color }))}
        authors={authors.map((a) => ({ id: a.id, name: a.name }))}
        allTags={tags.map((t) => ({ id: t.id, name: t.name }))}
      />
    </div>
  )
}
