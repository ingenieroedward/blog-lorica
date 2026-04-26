'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from './Navigation'
import { MobileMenu } from './MobileMenu'

interface NavItem {
  label: string
  href: string
  color?: string | null
}

interface HeaderProps {
  navItems: NavItem[]
}

export function Header({ navItems }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Skip to main content — accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
        style={{ color: 'var(--color-primary)' }}
      >
        Saltar al contenido principal
      </a>

      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-white border-b'
        }`}
        style={{ borderColor: scrolled ? 'transparent' : 'var(--color-border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              aria-label="Bajo Sinú - Ir al inicio"
            >
              {/* Marca gráfica: una ola estilizada representando el río Sinú */}
              <svg
                aria-hidden="true"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <rect width="28" height="28" rx="6" fill="var(--color-primary)" />
                <path
                  d="M5 16 Q9 10 14 14 Q19 18 23 12"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M5 20 Q9 14 14 18 Q19 22 23 16"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}
              >
                Bajo Sinú
              </span>
            </Link>

            {/* Nav desktop */}
            <nav
              aria-label="Navegación principal"
              className="hidden md:flex items-center gap-1"
            >
              <Navigation items={navItems} variant="horizontal" />
            </nav>

            {/* Acciones desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/blog"
                className="px-4 py-2 text-sm font-semibold rounded-full transition-colors text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Todos los artículos
              </Link>
            </div>

            {/* Botón hamburger mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú de navegación"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              style={{ color: '#374151' }}
            >
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
      />
    </>
  )
}
