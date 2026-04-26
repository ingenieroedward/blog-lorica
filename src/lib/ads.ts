import { db } from '@/db'
import { adSlots } from '@/db/schema'
import { eq, and, or, isNull, lte, gte, sql } from 'drizzle-orm'
import type { AdPosition } from '@/db/schema'

export type ActiveAd = {
  id: number
  name: string
  position: AdPosition
  size: string
  advertiser: string | null
  imageUrl: string | null
  linkUrl: string | null
  altText: string | null
  adCode: string | null
}

export async function getActiveAdByPosition(position: AdPosition): Promise<ActiveAd | null> {
  const now = new Date()

  const ad = await db.query.adSlots.findFirst({
    where: and(
      eq(adSlots.position, position),
      eq(adSlots.active, true),
      or(isNull(adSlots.startsAt), lte(adSlots.startsAt, now)),
      or(isNull(adSlots.endsAt),   gte(adSlots.endsAt,   now)),
    ),
    columns: {
      id: true, name: true, position: true, size: true,
      advertiser: true, imageUrl: true, linkUrl: true,
      altText: true, adCode: true,
    },
  })

  return ad ?? null
}

export async function trackImpression(id: number) {
  await db.update(adSlots)
    .set({ impressions: sql`${adSlots.impressions} + 1` })
    .where(eq(adSlots.id, id))
}

export async function trackClick(id: number) {
  await db.update(adSlots)
    .set({ clicks: sql`${adSlots.clicks} + 1` })
    .where(eq(adSlots.id, id))
}
