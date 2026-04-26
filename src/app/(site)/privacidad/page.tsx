import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: `Política de Privacidad | ${SITE_NAME}`,
  description: `Política de privacidad y uso de cookies de ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/privacidad` },
  robots: { index: true, follow: true },
}

const breadcrumbItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Política de Privacidad' },
]

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="text-3xl font-bold mb-2" style={{ color: '#111827', fontFamily: 'var(--font-serif)' }}>
        Política de Privacidad
      </h1>
      <p className="text-sm mb-10" style={{ color: 'var(--color-muted)' }}>
        Última actualización: abril de 2026
      </p>

      <div className="prose">
        <h2>1. Quiénes somos</h2>
        <p>
          <strong>Bajo Sinú</strong> (<a href={SITE_URL}>{SITE_URL}</a>) es un blog independiente
          dedicado a la cultura, historia y vida de Lorica, Córdoba, Colombia. El responsable del
          tratamiento de datos es el editor del sitio, contactable en{' '}
          <a href="mailto:contacto@bajosinú.com">contacto@bajosinú.com</a>.
        </p>

        <h2>2. Datos que recopilamos</h2>
        <p>No solicitamos registro de usuarios ni almacenamos datos personales identificables de
        forma activa. Sin embargo, como cualquier sitio web, se pueden recopilar de manera
        automática:</p>
        <ul>
          <li><strong>Datos de navegación</strong>: dirección IP (anonimizada), navegador, sistema
          operativo, páginas visitadas y tiempo de sesión, a través de herramientas de analítica.</li>
          <li><strong>Cookies de publicidad</strong>: si tienes habilitada la publicidad
          personalizada, Google AdSense puede usar cookies para mostrarte anuncios relevantes según
          tu actividad de navegación.</li>
          <li><strong>Cookies técnicas</strong>: necesarias para el correcto funcionamiento del
          sitio.</li>
        </ul>

        <h2>3. Publicidad — Google AdSense</h2>
        <p>
          Este sitio utiliza <strong>Google AdSense</strong>, un servicio de publicidad de Google
          LLC. AdSense puede usar cookies y balizas web para mostrar anuncios basados en tus visitas
          previas a este u otros sitios web.
        </p>
        <p>
          Google, como proveedor tercero, usa cookies para publicar anuncios en este sitio. El uso
          de la cookie DART por parte de Google le permite mostrar anuncios a los usuarios en función
          de sus visitas a este y otros sitios web.
        </p>
        <p>
          Puedes inhabilitar el uso de la cookie DART visitando la{' '}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            Política de privacidad de la Red de Display de Google
          </a>
          . También puedes optar por no recibir publicidad personalizada visitando{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Configuración de anuncios de Google
          </a>
          .
        </p>

        <h2>4. Cookies</h2>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo. Las usamos para:</p>
        <ul>
          <li>Garantizar el funcionamiento técnico del sitio.</li>
          <li>Analizar el tráfico de forma anónima (Google Analytics, si aplica).</li>
          <li>Mostrar publicidad relevante a través de Google AdSense.</li>
        </ul>
        <p>
          Puedes configurar tu navegador para rechazar todas las cookies o para que te avise cuando
          se envía una cookie. Sin embargo, si no aceptas las cookies, algunas partes del sitio
          podrían no funcionar correctamente.
        </p>

        <h2>5. Tus derechos</h2>
        <p>
          De conformidad con la <strong>Ley 1581 de 2012</strong> (Protección de Datos Personales de
          Colombia) y sus decretos reglamentarios, tienes derecho a:
        </p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos personales.</li>
          <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
          <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
          <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
          <li>Acceder gratuitamente a tus datos personales.</li>
        </ul>
        <p>
          Para ejercer estos derechos, escríbenos a{' '}
          <a href="mailto:contacto@bajosinú.com">contacto@bajosinú.com</a>.
        </p>

        <h2>6. Servicios de terceros</h2>
        <p>Este sitio puede contener enlaces a sitios web de terceros. No somos responsables de las
        prácticas de privacidad de esos sitios. Te recomendamos leer sus políticas de privacidad
        antes de proporcionarles cualquier dato personal.</p>

        <h2>7. Cambios en esta política</h2>
        <p>
          Nos reservamos el derecho de actualizar esta política cuando sea necesario. Los cambios
          se publicarán en esta misma página con la fecha de actualización. El uso continuado del
          sitio después de publicar cambios constituye tu aceptación de los mismos.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en{' '}
          <a href="mailto:contacto@bajosinú.com">contacto@bajosinú.com</a>.
        </p>
      </div>
    </div>
  )
}
