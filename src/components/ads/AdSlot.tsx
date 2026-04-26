import { getActiveAdByPosition } from '@/lib/ads'
import { AdTracker } from './AdTracker'
import type { AdPosition } from '@/db/schema'

type Props = {
  position: AdPosition
  className?: string
  label?: boolean
}

export async function AdSlot({ position, className, label = false }: Props) {
  const ad = await getActiveAdByPosition(position).catch(() => null)

  // No active ad — in production show nothing, in dev show placeholder
  if (!ad) {
    if (process.env.NODE_ENV !== 'development') return null
    return (
      <div
        className={`flex items-center justify-center text-xs rounded-lg border-2 border-dashed py-4 px-3 ${className ?? ''}`}
        style={{ borderColor: '#D1D5DB', color: '#9CA3AF', backgroundColor: '#F9FAFB', minHeight: '90px' }}
        aria-hidden="true"
      >
        [Espacio publicitario — {position}]
      </div>
    )
  }

  const inner = ad.adCode ? (
    // AdSense / custom HTML ad — rendered via AdSenseUnit on client
    <AdSenseInner adCode={ad.adCode} />
  ) : ad.imageUrl ? (
    <img
      src={ad.imageUrl}
      alt={ad.altText ?? `Publicidad — ${ad.advertiser ?? ad.name}`}
      className="w-full h-auto rounded"
      loading="lazy"
      decoding="async"
    />
  ) : (
    process.env.NODE_ENV === 'development' ? (
      <div
        className="flex items-center justify-center text-xs rounded-lg py-4 px-3"
        style={{ backgroundColor: '#EFF6FF', color: '#2D6A8F', minHeight: '90px' }}
      >
        {ad.name} · {ad.size}
      </div>
    ) : null
  )

  if (!inner) return null

  return (
    <AdTracker adId={ad.id} linkUrl={ad.adCode ? null : ad.linkUrl} className={className}>
      {label && (
        <p className="text-xs text-center mb-1" style={{ color: '#9CA3AF' }}>Publicidad</p>
      )}
      {inner}
    </AdTracker>
  )
}

// Client-side AdSense push
function AdSenseInner({ adCode }: { adCode: string }) {
  // adCode contains raw <ins> or script tags
  // dangerouslySetInnerHTML doesn't execute <script>, so we render the ins tag
  // and the global adsbygoogle.js (loaded in layout) handles it
  return <div dangerouslySetInnerHTML={{ __html: adCode }} />
}
