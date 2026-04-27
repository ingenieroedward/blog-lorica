import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: `Contacto | ${SITE_NAME}`,
  description: `¿Tienes una historia que contar o quieres colaborar con Bajo Sinú? Escríbenos.`,
  alternates: { canonical: `${SITE_URL}/contacto` },
}

const breadcrumbItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Contacto' },
]

export default function ContactoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <Breadcrumb items={breadcrumbItems} />

      <h1
        className="text-3xl md:text-4xl font-bold leading-tight mb-4"
        style={{ color: '#111827', fontFamily: 'var(--font-serif)' }}
      >
        Contacto
      </h1>
      <p className="text-lg leading-relaxed mb-10" style={{ color: '#4B5563' }}>
        ¿Tienes una historia que contar, una sugerencia o quieres colaborar con nosotros?
        Nos encantaría saber de ti.
      </p>

      {/* Contact cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <a
          href="mailto:hola@bajosinu.top"
          className="group flex items-start gap-4 p-5 rounded-xl border transition-colors hover:border-[var(--color-primary)]"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'white' }}
        >
          <div
            className="mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-primary)', opacity: 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: '#111827' }}>Correo electrónico</p>
            <p className="text-sm" style={{ color: 'var(--color-primary)' }}>hola@bajosinu.top</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Respondemos en menos de 48 h</p>
          </div>
        </a>

        <a
          href="https://instagram.com/bajosinu"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-4 p-5 rounded-xl border transition-colors hover:border-[var(--color-primary)]"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'white' }}
        >
          <div
            className="mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm mb-0.5" style={{ color: '#111827' }}>Instagram</p>
            <p className="text-sm" style={{ color: 'var(--color-primary)' }}>@bajosinu</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Síguenos para más historias</p>
          </div>
        </a>
      </div>

      {/* FAQ section */}
      <div className="prose">
        <h2>Preguntas frecuentes</h2>

        <h3>¿Puedo enviar un artículo o historia?</h3>
        <p>
          ¡Claro que sí! Si tienes una historia sobre Lorica, el Bajo Sinú o la Costa Caribe
          colombiana que crees que merece ser contada, escríbenos a{' '}
          <a href="mailto:hola@bajosinu.top">hola@bajosinu.top</a> con el asunto
          "Colaboración" y cuéntanos de qué trata.
        </p>

        <h3>¿Hacen publicidad o patrocinios?</h3>
        <p>
          Sí. Si tienes un negocio local, servicio turístico o producto relacionado con la región
          y quieres llegar a nuestra audiencia, escríbenos y hablamos.
        </p>

        <h3>¿Cómo corrijo un error en un artículo?</h3>
        <p>
          Nos importa publicar información precisa. Si encuentras un error, escríbenos indicando
          el artículo y la corrección. Lo revisamos y actualizamos lo antes posible.
        </p>
      </div>
    </div>
  )
}
