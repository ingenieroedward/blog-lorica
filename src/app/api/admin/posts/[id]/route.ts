import { NextRequest } from 'next/server'
import { verifyTokenFromHeader } from '@/lib/auth'
import { adminGetPost, adminUpdatePost, adminDeletePost } from '@/lib/admin/posts'
import { revalidatePath } from 'next/cache'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const post = await adminGetPost(Number(id))
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(post)
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const body = await request.json()
    const post = await adminUpdatePost({ ...body, id: Number(id) })

    // Revalidate on every save so changes are visible immediately
    revalidatePath('/', 'layout')
    revalidatePath('/blog', 'page')
    revalidatePath(`/blog/${post.slug}`, 'page')

    return Response.json(post)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await adminDeletePost(Number(id))
  revalidatePath('/', 'layout')
  revalidatePath('/blog', 'page')
  return Response.json({ ok: true })
}
