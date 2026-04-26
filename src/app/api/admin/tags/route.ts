import { NextRequest } from 'next/server'
import { verifyTokenFromHeader } from '@/lib/auth'
import { adminGetTags, adminCreateTag } from '@/lib/admin/tags'

export async function GET(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json(await adminGetTags())
}

export async function POST(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const tag = await adminCreateTag(body)
    return Response.json(tag, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 })
  }
}
