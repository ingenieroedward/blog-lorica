import { NextRequest } from 'next/server'
import { verifyTokenFromHeader } from '@/lib/auth'
import { adminGetAuthors, adminCreateAuthor } from '@/lib/admin/authors'

export async function GET(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json(await adminGetAuthors())
}

export async function POST(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const author = await adminCreateAuthor(body)
    return Response.json(author, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 })
  }
}
