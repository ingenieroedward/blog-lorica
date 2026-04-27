import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: `Sobre nosotros | ${SITE_NAME}`,
  description: `Conoce quiénes somos, nuestra misión y el amor que nos une a Lorica, Córdoba y el Bajo Sinú.`,
  alternates: { canonical: `${SITE_URL}/sobre-nosotros` },
}

const breadcrumbItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Sobre nosotros' },
]

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      <Breadcrumb items={breadcrumbItems} />

      <h1
        className="text-3xl md:text-4xl font-bold leading-tight mb-4"
        style={{ color: '#111827', fontFamily: 'var(--font-serif)' }}
      >
        Sobre Bajo Sinú
      </h1>
      <p className="text-lg leading-relaxed mb-10" style={{ color: '#4B5563' }}>
        La voz moderna del Bajo Sinú. Historias, cultura y vida de Lorica, Córdoba, Colombia.
      </p>

      <div className="prose">
        <h2>Quiénes somos</h2>
        <p>
          <strong>Bajo Sinú</strong> es un blog independiente nacido en Lorica, Córdoba, con el
          propósito de contar las historias que merecen ser contadas: las del Bajo Sinú, sus
          gentes, su cultura ribereña y su patrimonio histórico.
        </p>
        <p>
          Somos loriqueros convencidos de que nuestra tierra tiene mucho que decirle al mundo.
          Desde el malecón del río hasta los portales del mercado público, cada rincón de Lorica
          guarda una historia que vale la pena preservar y compartir.
        </p>

        <h2>Nuestra misión</h2>
        <p>
          Crear contenido de calidad sobre la vida, la cultura, la gastronomía, el turismo y los
          personajes del Bajo Sinú. Queremos ser el referente digital de la región: el sitio al que
          acudes cuando quieres saber qué pasa en Lorica, qué visitar, qué comer o simplemente
          entender un poco más de donde venimos.
        </p>

        <h2>Lo que encontrarás aquí</h2>
        <ul>
          <li><strong>Guías locales</strong>: qué hacer, qué ver y qué probar en Lorica y el Bajo Sinú.</li>
          <li><strong>Historia y patrimonio</strong>: la riqueza arquitectónica, cultural e histórica de la región.</li>
          <li><strong>Gastronomía</strong>: los sabores del río, la costa y la tradición costeña.</li>
          <li><strong>Personas y comunidad</strong>: las historias de loriqueros que inspiran.</li>
          <li><strong>Naturaleza y río</strong>: el Sinú como protagonista de la vida en la región.</li>
        </ul>

        <h2>Nuestra tierra</h2>
        <p>
          Lorica es una ciudad a orillas del río Sinú, en el departamento de Córdoba, en la Costa
          Caribe colombiana. Su centro histórico fue declarado <strong>Bien de Interés Cultural de
          la Nación</strong>, y su mercado público es uno de los más emblemáticos del país.
          Pero más allá de sus títulos, Lorica es una ciudad viva, con una identidad costeña única
          y una comunidad que la hace especial.
        </p>
        <p>
          Bajo Sinú es, en el fondo, una carta de amor a esa tierra.
        </p>

        <h2>Contacto</h2>
        <p>
          ¿Quieres colaborar, enviarnos una historia o simplemente saludarnos? Escríbenos en
          nuestra{' '}
          <a href="/contacto">página de contacto</a> o al correo{' '}
          <a href="mailto:hola@bajosinu.top">hola@bajosinu.top</a>.
        </p>
      </div>
    </div>
  )
}
