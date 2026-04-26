import { signAdminToken, setAdminCookie } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password || typeof password !== 'string') {
      return Response.json({ error: 'Credenciales requeridas' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD ?? ''

    // Timing-safe comparison via SHA-256 hash
    const inputHash = crypto.createHash('sha256').update(password).digest()
    const storedHash = crypto.createHash('sha256').update(adminPassword).digest()

    if (inputHash.length !== storedHash.length || !crypto.timingSafeEqual(inputHash, storedHash)) {
      return Response.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const token = await signAdminToken()
    await setAdminCookie(token)

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
