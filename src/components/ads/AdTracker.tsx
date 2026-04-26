'use client'

import { useEffect, useRef } from 'react'

type Props = {
  adId: number
  linkUrl?: string | null
  children: React.ReactNode
  className?: string
}

export function AdTracker({ adId, linkUrl, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const key = `ad_imp_${adId}`
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetch(`/api/ads/${adId}/impression`, { method: 'POST' }).catch(() => {})
          sessionStorage?.setItem(key, '1')
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [adId])

  function handleClick() {
    fetch(`/api/ads/${adId}/click`, { method: 'POST' }).catch(() => {})
  }

  return (
    <div ref={ref} className={className}>
      {linkUrl ? (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="block"
        >
          {children}
        </a>
      ) : (
        <div onClick={handleClick}>{children}</div>
      )}
    </div>
  )
}
