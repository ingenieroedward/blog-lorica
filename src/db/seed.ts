import { db } from './index'
import { authors, categories, posts, adSlots, siteSettings } from './schema'
import { slugify } from '@/lib/slug'

async function seed() {
  console.log('🌱 Iniciando seed...')

  // ─── Categorías (5 pilares) ───────────────────────────────────
  const categoryData = [
    { name: 'Gente',            slug: 'gente',            color: '#E84855', description: 'Historias reales de las personas que hacen grande al Bajo Sinú.' },
    { name: 'Cultura',          slug: 'cultura',          color: '#2D6A8F', description: 'Tradiciones, arte y patrimonio cultural de Lorica y el Bajo Sinú.' },
    { name: 'Río Sinú',         slug: 'rio-sinu',         color: '#1A8FCA', description: 'Todo sobre el río que le da vida a Lorica y sus comunidades.' },
    { name: 'Guías locales',    slug: 'guias-locales',    color: '#E07B39', description: 'Qué hacer, dónde comer y cómo moverse en Lorica, Córdoba.' },
    { name: 'Nueva generación', slug: 'nueva-generacion', color: '#6B5EA8', description: 'Emprendedores, creadores y jóvenes que están transformando el Bajo Sinú.' },
  ]

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing()
    .returning()

  console.log(`  ✓ ${insertedCategories.length} categorías creadas`)

  // ─── Autor ────────────────────────────────────────────────────
  const authorData = {
    name:      'Equipo Bajo Sinú',
    slug:      'equipo-bajo-sinu',
    bio:       'Somos un equipo de periodistas y apasionados de Lorica dedicados a contar las historias del Bajo Sinú con profundidad y amor por nuestra tierra.',
    shortBio:  'Periodistas y apasionados de Lorica.',
    image:     null,
    email:     null,
    twitter:   null,
    instagram: null,
  }

  const [author] = await db
    .insert(authors)
    .values(authorData)
    .onConflictDoNothing()
    .returning()

  console.log(`  ✓ Autor "${authorData.name}" creado`)

  // ─── Posts de prueba ──────────────────────────────────────────
  const allCategories = await db.select().from(categories)
  const culturaCategory = allCategories.find(c => c.slug === 'cultura')
  const guiasCategory   = allCategories.find(c => c.slug === 'guias-locales')
  const rioCategory     = allCategories.find(c => c.slug === 'rio-sinu')

  const seedAuthorId   = author?.id ?? 1
  const seedCulturaId  = culturaCategory?.id ?? 2
  const seedGuiasId    = guiasCategory?.id ?? 4
  const seedRioId      = rioCategory?.id ?? 3

  const postsData = [
    {
      title:       'Historia de Lorica: la ciudad que el Sinú construyó',
      slug:        'historia-lorica-ciudad-que-el-sinu-construyo',
      excerpt:     'Lorica no se entiende sin el Sinú. Su historia es la historia del río, de los pueblos Zenú, de los inmigrantes árabes y de una cultura que nunca para de crecer.',
      content:     '<h2>El origen de una ciudad singular</h2><p>Lorica es una de las ciudades más antiguas y culturalmente ricas del Caribe colombiano. Fundada a orillas del río Sinú, su historia está marcada por la confluencia de culturas indígenas, españolas y árabes que dejaron una huella única en su arquitectura, gastronomía y forma de vida.</p><h2>Los Zenú: los primeros loriqueros</h2><p>Antes de la llegada de los españoles, el territorio que hoy ocupa Lorica era habitado por los Zenú, una civilización avanzada que dominó las técnicas de hidráulica y orfebrería. Sus canales de irrigación asombraron a los conquistadores y aún son estudiados por ingenieros modernos.</p>',
      published:   true,
      publishedAt: new Date(),
      readingTime: 5,
      authorId:    seedAuthorId,
      categoryId:  seedCulturaId,
    },
    {
      title:       'Qué hacer en Lorica Córdoba: guía completa',
      slug:        'que-hacer-en-lorica-cordoba-guia-completa',
      excerpt:     'Desde el mercado público patrimonio hasta la playita del Sinú. Todo lo que no puedes perderte en Lorica, Córdoba.',
      content:     '<h2>El mercado público de Lorica</h2><p>El mercado público de Lorica es uno de los más bellos y mejor conservados del Caribe colombiano. Declarado patrimonio arquitectónico, su estructura árabe-andaluza es un testimonio vivo de la migración libanesa que transformó la ciudad a principios del siglo XX.</p><h2>La playita del Sinú</h2><p>A orillas del río Sinú, la Playita es el punto de encuentro de los loriqueros los fines de semana. Aquí puedes disfrutar de mojarra frita, patacones y la brisa del río mientras observas las embarcaciones tradicionales.</p>',
      published:   true,
      publishedAt: new Date(),
      readingTime: 7,
      authorId:    seedAuthorId,
      categoryId:  seedGuiasId,
    },
    {
      title:       'El río Sinú: arteria de vida del Bajo Sinú',
      slug:        'rio-sinu-arteria-de-vida-bajo-sinu',
      excerpt:     'El Sinú no es solo agua. Es economía, cultura, identidad y futuro de cientos de comunidades que lo han habitado por siglos.',
      content:     '<h2>Un río que define una región</h2><p>El río Sinú nace en el nudo paramillo en los Andes y recorre más de 400 kilómetros hasta desembocar en el golfo de Morrosquillo. En su camino, alimenta a decenas de municipios y define la vida cotidiana de toda una región.</p><h2>La pesca artesanal</h2><p>Para miles de familias ribereñas, el Sinú es la despensa. La pesca artesanal es un oficio que se transmite de generación en generación, con técnicas que los Zenú perfeccionaron hace siglos y que hoy conviven con las presiones de la modernidad.</p>',
      published:   true,
      publishedAt: new Date(),
      readingTime: 6,
      authorId:    seedAuthorId,
      categoryId:  seedRioId,
    },
  ]

  const insertedPosts = await db
    .insert(posts)
    .values(postsData)
    .onConflictDoNothing()
    .returning()

  console.log(`  ✓ ${insertedPosts.length} posts de prueba creados`)

  // ─── AdSlots (todos inactivos) ────────────────────────────────
  const adSlotsData = [
    { name: 'Header Banner',      position: 'HEADER'         as const, size: '728x90',  active: false },
    { name: 'Sidebar Top',        position: 'SIDEBAR_TOP'    as const, size: '300x250', active: false },
    { name: 'Sidebar Bottom',     position: 'SIDEBAR_BOTTOM' as const, size: '300x600', active: false },
    { name: 'In-Content 1',       position: 'IN_CONTENT_1'   as const, size: '336x280', active: false },
    { name: 'In-Content 2',       position: 'IN_CONTENT_2'   as const, size: '336x280', active: false },
    { name: 'Footer Banner',      position: 'FOOTER'         as const, size: '728x90',  active: false },
  ]

  await db.insert(adSlots).values(adSlotsData).onConflictDoNothing()
  console.log(`  ✓ 6 AdSlots creados (todos inactivos)`)

  // ─── Settings del sitio ───────────────────────────────────────
  const settings = [
    { key: 'site_name',        value: 'Bajo Sinú' },
    { key: 'site_tagline',     value: 'La voz moderna del Bajo Sinú' },
    { key: 'site_description', value: 'Historias, cultura y vida de Lorica, Córdoba, Colombia.' },
    { key: 'facebook_url',     value: '' },
    { key: 'instagram_url',    value: '' },
    { key: 'tiktok_url',       value: '' },
  ]

  await db.insert(siteSettings).values(settings).onConflictDoNothing()
  console.log(`  ✓ Settings del sitio creados`)

  console.log('\n✅ Seed completado')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err)
  process.exit(1)
})
