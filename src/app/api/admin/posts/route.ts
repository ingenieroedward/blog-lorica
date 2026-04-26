import { NextRequest } from 'next/server'
import { verifyTokenFromHeader } from '@/lib/auth'
import { adminGetPosts, adminCreatePost } from '@/lib/admin/posts'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const posts = await adminGetPosts()
  return Response.json(posts)
}

export async function POST(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const post = await adminCreatePost(body)

    if (post.published) {
      revalidatePath('/', 'layout')
      revalidatePath('/blog', 'page')
      revalidatePath(`/blog/${post.slug}`, 'page')
    }

    return Response.json(post, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 })
  }
}
