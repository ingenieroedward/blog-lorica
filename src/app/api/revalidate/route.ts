import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { path, tag, type } = body

    if (tag) {
      revalidateTag(tag, 'default')
    } else if (path) {
      revalidatePath(path, type ?? 'page')
    } else {
      // Revalidate all public pages
      revalidatePath('/', 'layout')
      revalidatePath('/blog', 'page')
    }

    return Response.json({ revalidated: true, at: new Date().toISOString() })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
