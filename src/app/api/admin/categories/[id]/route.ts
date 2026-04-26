import { NextRequest } from 'next/server'
import { verifyTokenFromHeader } from '@/lib/auth'
import { adminUpdateCategory, adminDeleteCategory } from '@/lib/admin/categories'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const body = await request.json()
    const cat = await adminUpdateCategory(Number(id), body)
    return Response.json(cat)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await adminDeleteCategory(Number(id))
  return Response.json({ ok: true })
}
