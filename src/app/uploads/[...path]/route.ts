import { readFile } from 'fs/promises'
import path from 'path'
import { NextRequest } from 'next/server'

const MIME: Record<string, string> = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  gif:  'image/gif',
  svg:  'image/svg+xml',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path
  const filePath = path.join(process.cwd(), 'public', 'uploads', ...segments)

  let data: Buffer
  try {
    data = await readFile(filePath)
  } catch {
    return new Response('Not found', { status: 404 })
  }

  const ext = segments.at(-1)?.split('.').pop()?.toLowerCase() ?? 'jpg'
  return new Response(data, {
    headers: {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
