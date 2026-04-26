import { db } from '@/db'
import { adSlots } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { AdPosition } from '@/db/schema'

export async function adminGetAds() {
  return db.query.adSlots.findMany({
    orderBy: [desc(adSlots.createdAt)],
  })
}

export async function adminCreateAd(input: {
  name: string
  position: AdPosition
  size: string
  advertiser?: string
  imageUrl?: string
  linkUrl?: string
  altText?: string
  adCode?: string
  active?: boolean
  startsAt?: string
  endsAt?: string
}) {
  const [ad] = await db.insert(adSlots).values({
    name:       input.name,
    position:   input.position,
    size:       input.size,
    advertiser: input.advertiser,
    imageUrl:   input.imageUrl,
    linkUrl:    input.linkUrl,
    altText:    input.altText,
    adCode:     input.adCode,
    active:     input.active ?? false,
    startsAt:   input.startsAt ? new Date(input.startsAt) : null,
    endsAt:     input.endsAt   ? new Date(input.endsAt)   : null,
  }).returning()
  return ad
}

export async function adminUpdateAd(id: number, input: Partial<Parameters<typeof adminCreateAd>[0]>) {
  const [ad] = await db.update(adSlots)
    .set({
      ...input,
      startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
      endsAt:   input.endsAt   ? new Date(input.endsAt)   : undefined,
    })
    .where(eq(adSlots.id, id))
    .returning()
  return ad
}

export async function adminDeleteAd(id: number) {
  await db.delete(adSlots).where(eq(adSlots.id, id))
}
