'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Navigation } from './Navigation'

interface NavItem {
  label: string
  href: string
  color?: string | null
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
}

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Foco al abrir
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector<HTMLElement>(
        'a, button, [tabindex="0"]',
      )
      firstFocusable?.focus()
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[90vw] bg-white shadow-2xl
          flex flex-col transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Cabecera del panel */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2"
            aria-label="Bajo Sinú - Inicio"
          >
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}
            >
              Bajo Sinú
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: '#374151' }}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav aria-label="Menú principal" className="flex-1 overflow-y-auto px-3 py-4">
          <p
            className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-muted)' }}
          >
            Categorías
          </p>
          <Navigation items={navItems} variant="vertical" onItemClick={onClose} />
        </nav>

        {/* Footer del panel */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
            <Link href="/blog" onClick={onClose}
              className="hover:text-[var(--color-primary)] transition-colors py-1">
              Todos los artículos
            </Link>
            <Link href="/sobre-nosotros" onClick={onClose}
              className="hover:text-[var(--color-primary)] transition-colors py-1">
              Sobre nosotros
            </Link>
            <Link href="/contacto" onClick={onClose}
              className="hover:text-[var(--color-primary)] transition-colors py-1">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
