import { getCategories } from '@/lib/categories'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AdSlot } from '@/components/ads/AdSlot'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories().catch(() => [])

  const navItems = categories.map((cat) => ({
    label: cat.name,
    href: `/categoria/${cat.slug}`,
    color: cat.color,
  }))

  const footerCategories = categories.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
  }))

  return (
    <>
      <Header navItems={navItems} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <AdSlot
        position="FOOTER"
        label
        className="max-w-6xl mx-auto px-4 sm:px-6 py-4"
      />
      <Footer categories={footerCategories} />
    </>
  )
}
