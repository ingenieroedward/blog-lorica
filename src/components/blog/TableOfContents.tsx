'use client'

import { useEffect, useState, useRef } from 'react'

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

interface TableOfContentsProps {
  /** HTML del artículo — se parsea en el cliente para extraer H2/H3 */
  html: string
}

function extractHeadings(html: string): TocItem[] {
  // Ejecutar solo en cliente
  if (typeof document === 'undefined') return []

  const container = document.createElement('div')
  container.innerHTML = html

  const headings = container.querySelectorAll('h2, h3')
  const items: TocItem[] = []

  headings.forEach((el) => {
    const generated = (el.textContent ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    const id = el.id || generated

    if (!el.id && id) {
      el.id = id
    }

    const level = parseInt(el.tagName[1]) as 2 | 3
    items.push({ id, text: el.textContent ?? '', level })
  })

  return items
}

export function TableOfContents({ html }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Extraer headings del HTML en el cliente
  useEffect(() => {
    const extracted = extractHeadings(html)
    setItems(extracted)
    if (extracted.length > 0) setActiveId(extracted[0].id)
  }, [html])

  // Scroll-spy con IntersectionObserver
  useEffect(() => {
    if (items.length === 0) return

    // Dar IDs a los headings del DOM real (por si no los tienen)
    items.forEach(({ id, text }) => {
      const existing = document.getElementById(id)
      if (!existing) {
        // Buscar por texto
        const all = document.querySelectorAll('h2, h3')
        all.forEach((el) => {
          if (el.textContent?.trim() === text.trim() && !el.id) {
            el.id = id
          }
        })
      }
    })

    const visibleHeadings = new Map<string, number>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleHeadings.set(entry.target.id, entry.intersectionRatio)
        })

        // Activar el heading más visible o el último que pasó
        let bestId = ''
        let bestRatio = -1
        visibleHeadings.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        })

        if (bestId && bestRatio > 0) setActiveId(bestId)
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
      },
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [items])

  if (items.length < 2) return null

  const handleClick = (id: string) => {
    setActiveId(id)
    setIsOpen(false)
    const el = document.getElementById(id)
    if (el) {
      const offset = 88 // altura del header sticky
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav
      aria-label="Tabla de contenidos"
      className="my-8 rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--color-border)', backgroundColor: '#FAFAF8' }}
    >
      {/* Cabecera — siempre visible, toggle en mobile */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left md:cursor-default md:pointer-events-none"
        aria-expanded={isOpen}
        aria-controls="toc-list"
      >
        <span
          className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
          style={{ color: 'var(--color-primary)' }}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          En este artículo
        </span>
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 md:hidden ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--color-muted)' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Lista de items — en desktop siempre visible, en mobile togglable */}
      <ul
        id="toc-list"
        role="list"
        className={`
          px-5 pb-4 space-y-1 border-t
          md:block
          ${isOpen ? 'block' : 'hidden'}
        `}
        style={{ borderColor: 'var(--color-border)' }}
      >
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
              <button
                type="button"
                onClick={() => handleClick(item.id)}
                className={`
                  w-full text-left text-sm py-1.5 px-2 rounded-md transition-all duration-150
                  ${item.level === 3 ? 'text-[0.8125rem]' : ''}
                  ${isActive
                    ? 'font-semibold'
                    : 'hover:bg-gray-100'
                  }
                `}
                style={{
                  color: isActive ? 'var(--color-primary)' : '#4B5563',
                  borderLeft: isActive ? `3px solid var(--color-primary)` : '3px solid transparent',
                }}
                aria-current={isActive ? 'location' : undefined}
              >
                {item.text}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
