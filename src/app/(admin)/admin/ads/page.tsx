import { adminGetAds } from '@/lib/admin/ads'
import { AdsClient } from '@/components/admin/AdsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAdsPage() {
  const ads = await adminGetAds()
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>Anuncios</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
          Gestiona espacios publicitarios y monitorea impressiones y clics
        </p>
      </div>
      <AdsClient initialAds={ads.map((a) => ({
        ...a,
        startsAt: a.startsAt?.toISOString() ?? null,
        endsAt:   a.endsAt?.toISOString()   ?? null,
      })) as Parameters<typeof AdsClient>[0]['initialAds']} />
    </div>
  )
}
