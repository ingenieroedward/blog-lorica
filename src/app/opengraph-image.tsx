import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export const runtime = 'edge'
export const alt = `${SITE_NAME} — ${SITE_DESCRIPTION}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2D6A8F 0%, #1e4d6b 100%)',
          padding: '80px',
        }}
      >
        {/* Decorative wave */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '160px',
            opacity: 0.1,
            background: 'white',
            borderRadius: '100% 100% 0 0',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.2)',
            marginBottom: 32,
            fontSize: 36,
            fontWeight: 700,
            color: 'white',
          }}
        >
          BS
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-2px',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          {SITE_DESCRIPTION}
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 18,
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Lorica · Córdoba · Colombia
        </div>
      </div>
    ),
    size,
  )
}
