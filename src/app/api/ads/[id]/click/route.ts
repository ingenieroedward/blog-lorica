import { NextRequest } from 'next/server'
import { trackClick } from '@/lib/ads'

type Params = { params: Promise<{ id: string }> }

export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await trackClick(Number(id))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 500 })
  }
}
