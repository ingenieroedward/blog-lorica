import { NextRequest } from 'next/server'
import { verifyTokenFromHeader } from '@/lib/auth'
import { adminGetAds, adminCreateAd } from '@/lib/admin/ads'

export async function GET(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return Response.json(await adminGetAds())
}

export async function POST(request: NextRequest) {
  if (!(await verifyTokenFromHeader(request.headers.get('cookie') ?? ''))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const ad = await adminCreateAd(body)
    return Response.json(ad, { status: 201 })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 })
  }
}
