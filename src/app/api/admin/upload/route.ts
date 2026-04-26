import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { verifyTokenFromHeader } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? ''
  if (!(await verifyTokenFromHeader(cookieHeader))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
  }

  const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'El archivo supera el límite de 5 MB' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop() ?? 'jpg'
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const now = new Date()
  const folder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, name), buffer)

  return Response.json({ url: `/uploads/${folder}/${name}` })
}
