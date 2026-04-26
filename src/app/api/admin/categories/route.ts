import { NextRequest } from 'next/server'
import { verifyTokenFromHeader } from '@/lib/auth'
import { adminGetCategories, adminCreateCategory } from '@/lib/admin/categories'

export async function GET(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json(await adminGetCategories())
}

export async function POST(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const cat = await adminCreateCategory(body)
    return Response.json(cat, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 })
  }
}
