# Plan de Acción: Blog "Bajo Sinú" — Lorica, Córdoba

## Visión
Construir el blog de referencia sobre Lorica, Córdoba, Colombia. Estrategia: tráfico orgánico primero (SEO), monetización con espacios publicitarios después.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend/Backend | Next.js 14+ (App Router), React, TypeScript |
| Base de datos | PostgreSQL 16 |
| ORM | Drizzle ORM |
| Despliegue | Dokploy (self-hosted PaaS en VPS, Docker/Traefik) |
| Estilos | Tailwind CSS + @tailwindcss/typography |
| Editor de contenido | TipTap (ProseMirror-based) |
| Fuentes | next/font (Inter + Lora self-hosted) |

### Por qué este stack y no otro

| Decisión | Alternativa descartada | Razón del cambio |
|----------|----------------------|-----------------|
| PostgreSQL | MySQL | Mejor full-text search nativo, mejor ecosistema, mejor JSON, mismo rendimiento en VPS |
| Drizzle ORM | Prisma | Más rápido, bundle más liviano, SQL tipado real, funciona en Edge sin problemas |
| Next.js App Router | Astro | El proyecto tiene panel admin dinámico, ads, vistas en tiempo real — Next.js es más natural para eso |
| Dokploy | Vercel | Control total, sin costos de hosting externo, self-hosted en VPS propio |

---

## Arquitectura de Deploy (Dokploy)

Dos servicios en red Docker interna:
1. **`postgres`** — imagen `postgres:16-alpine`, volumen persistente, no expuesto al exterior
2. **`nextjs`** — build desde Dockerfile multi-etapa, modo `standalone`, puerto 3000, Traefik + Let's Encrypt automático

Variable `DATABASE_URL` en Next.js apunta al hostname interno de PostgreSQL (`postgres:5432`).

---

## Estructura de Carpetas

```
blog-lorica/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml          # Solo MySQL, para desarrollo local
├── next.config.ts              # output: 'standalone'
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── PLAN.md                     # Este archivo
│
├── drizzle.config.ts               # Config de Drizzle Kit (migraciones)
│
├── src/db/
│   ├── index.ts                    # Conexión a PostgreSQL (singleton)
│   ├── schema.ts                   # Schema completo en TypeScript
│   ├── migrate.ts                  # Script para correr migraciones
│   ├── seed.ts                     # Datos iniciales
│   └── migrations/                 # Archivos SQL generados por drizzle-kit
│
├── public/
│   ├── favicon.ico
│   ├── og-default.jpg          # 1200x630 — OG fallback
│   └── fonts/
│
└── src/
    ├── app/
    │   ├── layout.tsx           # Root layout, <html lang="es">, fonts, metadataBase
    │   ├── page.tsx             # Homepage
    │   ├── not-found.tsx
    │   ├── error.tsx
    │   ├── loading.tsx
    │   ├── sitemap.ts           # Genera /sitemap.xml dinámico
    │   ├── robots.ts
    │   │
    │   ├── (blog)/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx         # /blog
    │   │   └── [slug]/
    │   │       ├── page.tsx     # /blog/[slug]
    │   │       └── loading.tsx
    │   │
    │   ├── categoria/[slug]/page.tsx
    │   ├── autor/[slug]/page.tsx
    │   ├── sobre-nosotros/page.tsx
    │   ├── contacto/page.tsx
    │   ├── politica-de-privacidad/page.tsx
    │   │
    │   └── api/
    │       ├── posts/route.ts
    │       ├── views/[slug]/route.ts
    │       ├── ads/[id]/impression/route.ts
    │       ├── ads/[id]/click/route.ts
    │       ├── newsletter/route.ts
    │       └── revalidate/route.ts
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Navigation.tsx
    │   │   └── MobileMenu.tsx
    │   │
    │   ├── blog/
    │   │   ├── PostCard.tsx
    │   │   ├── PostGrid.tsx
    │   │   ├── PostHero.tsx
    │   │   ├── PostContent.tsx
    │   │   ├── PostMeta.tsx
    │   │   ├── RelatedPosts.tsx
    │   │   ├── CategoryBadge.tsx
    │   │   ├── AuthorCard.tsx
    │   │   └── TableOfContents.tsx
    │   │
    │   ├── ads/
    │   │   ├── AdSlot.tsx        # Componente genérico de ad (AdSense + directo)
    │   │   ├── AdBanner.tsx      # 728x90 / 320x50
    │   │   ├── AdSidebar.tsx     # 300x250 / 300x600
    │   │   └── AdInContent.tsx   # 336x280, entre párrafos
    │   │
    │   ├── seo/
    │   │   ├── JsonLd.tsx
    │   │   ├── BreadcrumbJsonLd.tsx
    │   │   └── ArticleJsonLd.tsx
    │   │
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Image.tsx
    │   │   ├── Breadcrumb.tsx
    │   │   ├── Pagination.tsx
    │   │   └── Newsletter.tsx
    │   │
    │   └── admin/
    │       ├── PostForm.tsx
    │       ├── PostList.tsx
    │       └── RichTextEditor.tsx  # dynamic import, ssr: false
    │
    ├── lib/
    │   ├── posts.ts
    │   ├── authors.ts
    │   ├── categories.ts
    │   ├── ads.ts
    │   ├── analytics.ts
    │   ├── seo.ts
    │   ├── slug.ts
    │   └── constants.ts          # SITE_NAME, SITE_URL, POSTS_PER_PAGE
    │
    ├── types/
    │   ├── blog.ts
    │   └── ads.ts
    │
    └── styles/
        └── globals.css
```

---

## Schema de Base de Datos (Drizzle ORM — PostgreSQL)

El schema vive en `src/db/schema.ts`. Es TypeScript puro — sin lenguaje especial, sin codegen obligatorio.

```typescript
// src/db/schema.ts
import {
  pgTable, pgEnum, serial, varchar, text, boolean,
  timestamp, integer, index, primaryKey,
} from 'drizzle-orm/pg-core'

// ─── Enum: posiciones de anuncios ────────────────────────────
export const adPositionEnum = pgEnum('ad_position', [
  'HEADER', 'SIDEBAR_TOP', 'SIDEBAR_BOTTOM',
  'IN_CONTENT_1', 'IN_CONTENT_2', 'FOOTER',
])

// ─── Autores ─────────────────────────────────────────────────
export const authors = pgTable('authors', {
  id:        serial('id').primaryKey(),
  name:      varchar('name', { length: 100 }).notNull(),
  slug:      varchar('slug', { length: 120 }).notNull().unique(),
  bio:       text('bio').notNull(),
  shortBio:  varchar('short_bio', { length: 200 }).notNull(),
  image:     varchar('image', { length: 500 }),
  email:     varchar('email', { length: 200 }).unique(),
  twitter:   varchar('twitter', { length: 100 }),
  instagram: varchar('instagram', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [index('author_slug_idx').on(t.slug)])

// ─── Categorías (5 pilares de contenido) ─────────────────────
export const categories = pgTable('categories', {
  id:          serial('id').primaryKey(),
  name:        varchar('name', { length: 100 }).notNull(),
  slug:        varchar('slug', { length: 120 }).notNull().unique(),
  description: text('description'),
  color:       varchar('color', { length: 7 }),       // hex: #2D6A8F
  image:       varchar('image', { length: 500 }),
  metaTitle:   varchar('meta_title', { length: 70 }),
  metaDesc:    varchar('meta_desc', { length: 160 }),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
}, (t) => [index('category_slug_idx').on(t.slug)])

// ─── Tags (long-tail SEO) ─────────────────────────────────────
export const tags = pgTable('tags', {
  id:        serial('id').primaryKey(),
  name:      varchar('name', { length: 100 }).notNull(),
  slug:      varchar('slug', { length: 120 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [index('tag_slug_idx').on(t.slug)])

// ─── Posts ────────────────────────────────────────────────────
export const posts = pgTable('posts', {
  id:            serial('id').primaryKey(),
  title:         varchar('title', { length: 200 }).notNull(),
  slug:          varchar('slug', { length: 220 }).notNull().unique(),
  content:       text('content').notNull(),
  excerpt:       text('excerpt').notNull(),
  coverImage:    varchar('cover_image', { length: 500 }),
  coverImageAlt: varchar('cover_image_alt', { length: 200 }),
  metaTitle:     varchar('meta_title', { length: 70 }),
  metaDesc:      varchar('meta_desc', { length: 160 }),
  canonicalUrl:  varchar('canonical_url', { length: 500 }),
  published:     boolean('published').default(false).notNull(),
  publishedAt:   timestamp('published_at'),
  readingTime:   integer('reading_time'),            // minutos, calculado al guardar
  authorId:      integer('author_id').notNull().references(() => authors.id),
  categoryId:    integer('category_id').notNull().references(() => categories.id),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (t) => [
  index('post_slug_idx').on(t.slug),
  index('post_published_idx').on(t.published, t.publishedAt),
  index('post_category_idx').on(t.categoryId, t.published),
  index('post_author_idx').on(t.authorId),
])

// ─── Post ↔ Tag (M2M) ─────────────────────────────────────────
export const postTags = pgTable('post_tags', {
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId:  integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.postId, t.tagId] }),
  index('post_tags_tag_idx').on(t.tagId),
])

// ─── Post ↔ Post relacionados (interlinking estructurado) ─────
export const postRelations = pgTable('post_relations', {
  sourcePostId: integer('source_post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  targetPostId: integer('target_post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  order:        integer('order').default(0).notNull(),
}, (t) => [primaryKey({ columns: [t.sourcePostId, t.targetPostId] })])

// ─── Vistas (analytics privado, sin GA) ──────────────────────
export const postViews = pgTable('post_views', {
  id:       serial('id').primaryKey(),
  postId:   integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  date:     varchar('date', { length: 10 }).notNull(), // "2026-04-25" — GROUP BY día eficiente
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
}, (t) => [
  index('post_views_post_idx').on(t.postId),
  index('post_views_date_idx').on(t.postId, t.date),
])

// ─── Slots publicitarios ──────────────────────────────────────
export const adSlots = pgTable('ad_slots', {
  id:          serial('id').primaryKey(),
  name:        varchar('name', { length: 100 }).notNull(),
  position:    adPositionEnum('position').notNull(),
  size:        varchar('size', { length: 50 }).notNull(),     // "300x250"
  advertiser:  varchar('advertiser', { length: 200 }),        // nombre negocio local
  imageUrl:    varchar('image_url', { length: 500 }),
  linkUrl:     varchar('link_url', { length: 500 }),
  altText:     varchar('alt_text', { length: 200 }),
  adCode:      text('ad_code'),                               // HTML/JS de AdSense
  active:      boolean('active').default(false).notNull(),
  startsAt:    timestamp('starts_at'),
  endsAt:      timestamp('ends_at'),
  impressions: integer('impressions').default(0).notNull(),
  clicks:      integer('clicks').default(0).notNull(),
  categoryId:  integer('category_id'),                        // null = todas las páginas
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (t) => [index('ad_slot_position_idx').on(t.position, t.active)])

// ─── Configuración del sitio (key-value) ──────────────────────
export const siteSettings = pgTable('site_settings', {
  key:       varchar('key', { length: 100 }).primaryKey(),
  value:     text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdateFn(() => new Date()),
})

// ─── Newsletter ───────────────────────────────────────────────
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id:           serial('id').primaryKey(),
  email:        varchar('email', { length: 200 }).notNull().unique(),
  name:         varchar('name', { length: 100 }),
  active:       boolean('active').default(true).notNull(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  confirmedAt:  timestamp('confirmed_at'),
}, (t) => [index('newsletter_active_idx').on(t.active)])
```

### Conexión a la DB (`src/db/index.ts`)

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })
```

No se necesita patrón singleton como en Prisma — `Pool` de `pg` gestiona las conexiones internamente.

### Configuración de Drizzle Kit (`drizzle.config.ts`)

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

---

## Fases de Desarrollo

### Fase 1: Base Técnica
- Scaffold Next.js 14 con las flags correctas
- Instalar Drizzle ORM + `pg` + `drizzle-kit`
- Escribir `src/db/schema.ts` completo (10 tablas)
- `drizzle.config.ts` apuntando al schema
- `npx drizzle-kit generate` → genera la primera migración SQL
- `npx drizzle-kit migrate` → aplica la migración a PostgreSQL local
- Seed con 5 categorías, 1 autor, 3 posts de prueba, 6 AdSlots (inactivos)
- Queries base en `lib/posts.ts`, `lib/authors.ts`, `lib/categories.ts`
- `next.config.ts` con `output: 'standalone'`
- `npm run build` pasando limpio

### Fase 2: SEO Técnico
- `app/sitemap.ts` dinámico (posts + páginas estáticas + categorías + autores)
- `app/robots.ts`
- `metadataBase` + metadata dinámica por ruta
- JSON-LD `Article` + `BreadcrumbList` por artículo (`@graph`)
- `generateStaticParams` en rutas dinámicas
- ISR: `revalidate = 3600` listados, `revalidate = 86400` artículos
- Headers de seguridad en `next.config.ts`
- Canónicas automáticas

### Fase 3: UI/UX
- Paleta: azul-río `#2D6A8F`, accent `#E07B39`, fondo `#FAFAF8`
- Tipografía: `Inter` (UI) + `Lora` (cuerpo artículos)
- Componentes: Header sticky, Footer, PostCard, PostGrid, ArticleLayout 2 columnas
- AuthorCard al final de cada artículo (E-E-A-T)
- TableOfContents con scroll-spy
- Breadcrumb visible
- Páginas de categoría y autor

### Fase 4: Sistema de Contenido / Admin
- Middleware de autenticación para `/admin/*`
- Login con cookie httpOnly
- Editor TipTap (dynamic import, ssr: false)
- CRUD de posts con auto-slug y auto-readingTime
- Panel de categorías, tags, autores
- Upload de imágenes (volumen Docker persistente en Dokploy)
- Herramienta de interlinking en el editor

### Fase 5: Sistema de Ads
- `lib/ads.ts`: `getActiveAdsByPosition(position)`
- Componente `AdSlot` genérico (AdSense + ads directos + placeholder fijo)
- 6 posiciones integradas en el layout
- Inserción in-content después del 3er párrafo (server-side con cheerio)
- Tracking de impresiones (IntersectionObserver) y clics (Route Handler)
- Panel admin de ads con métricas
- Página de política de privacidad

### Fase 6: Deploy en Dokploy
- Dockerfile multi-etapa (deps → builder → runner), modo standalone
- Servicio PostgreSQL en Dokploy con volumen persistente
- Variables de entorno en Dokploy
- Dominio + SSL automático (Traefik + Let's Encrypt)
- Redirect www → non-www
- `npx drizzle-kit migrate` en CMD del Dockerfile antes de `node server.js`

---

## Dockerfile

Con Drizzle no hay paso de code generation — el schema es TypeScript puro. Las migraciones son archivos SQL en `src/db/migrations/` que se commitean al repo y se aplican en producción con `drizzle-kit migrate`.

```dockerfile
# ── Etapa 1: dependencias ─────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Etapa 2: build ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Etapa 3: producción ───────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Migraciones SQL y config de drizzle-kit
COPY --from=builder /app/src/db/migrations ./src/db/migrations
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Aplica migraciones pendientes y luego inicia el servidor
CMD npx drizzle-kit migrate && node server.js
```

---

## docker-compose.yml (desarrollo local)

Solo levanta PostgreSQL. Next.js corre con `npm run dev` directamente en la máquina — sin container para desarrollo.

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: bajosinu_postgres
    environment:
      POSTGRES_DB: bajosinu
      POSTGRES_USER: bajosinu_user
      POSTGRES_PASSWORD: bajosinu_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bajosinu_user -d bajosinu"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## Variables de Entorno (.env.example)

```bash
# Base de datos (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/bajosinu"
# Desarrollo local: postgresql://bajosinu_user:bajosinu_pass@localhost:5432/bajosinu

# Sitio
NEXT_PUBLIC_SITE_URL="https://bajosinú.com"

# Admin
ADMIN_EMAIL="admin@bajosinú.com"
ADMIN_PASSWORD_HASH="bcrypt_hash_aqui"
AUTH_SECRET="string_aleatorio_64_chars"

# Imágenes (opcional: Cloudinary)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=""

# ISR on-demand
REVALIDATE_SECRET="string_aleatorio_para_webhook"
```

---

## Estrategia SEO — Keywords Objetivo

**Informacionales:**
- qué ver en Lorica Córdoba
- historia de Lorica Córdoba
- cultura del Bajo Sinú
- gastronomía de Lorica
- fiestas de Lorica
- río Sinú Colombia
- artesanías de Lorica
- Lorica patrimonio histórico
- mercado público de Lorica

**Guías / transaccionales:**
- qué hacer en Lorica en un día
- restaurantes en Lorica Córdoba
- cómo llegar a Lorica desde Montería
- hoteles en Lorica Córdoba
- tour río Sinú Lorica

**Long-tail (baja competencia, alta conversión):**
- historia de los árabes en Lorica Colombia
- festival del río Sinú Lorica
- platos típicos de Lorica Córdoba
- emprendedores jóvenes de Lorica
- tradiciones Semana Santa Lorica
- cerámica Zenú Lorica
- migrantes libaneses Lorica historia

---

## Mapa de Slots Publicitarios

```
┌──────────────────────────────────────────────────────────┐
│  HEADER — 728x90 desktop / 320x50 mobile (todas las páginas) │
├─────────────────────────────┬────────────────────────────┤
│                             │  SIDEBAR_TOP 300x250       │
│  Artículo                   ├────────────────────────────┤
│                             │  Artículos relacionados    │
│  [párrafo 1-3]              ├────────────────────────────┤
│  ── IN_CONTENT_1 336x280 ── │  SIDEBAR_BOTTOM 300x600    │
│  [párrafo 4-N/2]            │  (mayor RPM)               │
│  ── IN_CONTENT_2 336x280 ── │                            │
│  [resto]                    │                            │
│  [AuthorCard]               │                            │
└─────────────────────────────┴────────────────────────────┘
│  FOOTER — 728x90                                         │
└──────────────────────────────────────────────────────────┘
```

---

## Checklist de Lanzamiento

### Antes del primer artículo

**Técnico:**
- [ ] `npm run build` sin errores
- [ ] `npx drizzle-kit migrate` exitoso en producción
- [ ] `/sitemap.xml` válido
- [ ] `/robots.txt` correcto
- [ ] Metadata única en todas las páginas
- [ ] Open Graph funcional (testear con opengraph.xyz)
- [ ] JSON-LD válido (testear con Rich Results Test de Google)
- [ ] HTTPS activo
- [ ] Redirect www → non-www
- [ ] Headers de seguridad activos
- [ ] Lighthouse mobile ≥ 90 Performance, 100 SEO, 100 Accessibility
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms

**Contenido:**
- [ ] Página "Sobre Nosotros" publicada
- [ ] Página de Contacto publicada
- [ ] Política de Privacidad publicada
- [ ] 5 categorías con descripción e imagen
- [ ] Al menos 1 autor con foto real y bio
- [ ] Al menos 5 artículos de calidad publicados

**SEO:**
- [ ] Google Search Console verificado + sitemap enviado
- [ ] Bing Webmaster Tools configurado
- [ ] Google Analytics 4 o Plausible instalado

### Antes de vender el primer espacio publicitario

- [ ] Mínimo 20 artículos publicados
- [ ] Mínimo 500 visitas únicas mensuales
- [ ] Mínimo 2 meses de operación
- [ ] Tráfico orgánico visible en Analytics
- [ ] 6 AdSlots en DB (todos `active: false`)
- [ ] `AdSlot` con placeholders de tamaño fijo (anti-CLS)
- [ ] Tracking de impresiones y clics funcionando
- [ ] Política de privacidad menciona cookies publicitarias
- [ ] Tarifario preparado con métricas reales
- [ ] Email comercial activo (`publicidad@dominio.com`)

---

## Decisiones Técnicas Clave

| Decisión | Razón |
|----------|-------|
| PostgreSQL en lugar de MySQL | Mejor full-text search, mejor JSON, mismo rendimiento en VPS, ecosistema más activo |
| Drizzle en lugar de Prisma | Más rápido, bundle más liviano, SQL tipado real, sin code generation, funciona en Edge |
| `output: 'standalone'` desde el inicio | Reduce imagen Docker de ~1GB a ~100MB |
| `Pool` de `pg` en Drizzle | Gestiona conexiones internamente — no necesita patrón singleton manual |
| Migraciones SQL commiteadas al repo | Las migraciones son artefactos de producción, no se regeneran — control total |
| `publishedAt` separado de `createdAt` | Permite programar publicaciones futuras |
| `PostView.date` como string `YYYY-MM-DD` | GROUP BY por día eficiente sin funciones de fecha |
| TipTap con `dynamic(..., { ssr: false })` | No añade bundle al cliente del blog público |
| `generateStaticParams` aunque vacío | Evita fallos de build en modo standalone |
| Fuentes self-hosted con `next/font` | Elimina layout shift y petición externa a Google Fonts |
| `metadataBase` en root layout | URLs de OG absolutas — sin esto Twitter/WhatsApp reciben rutas relativas |

---

## Futuro (no en esta fase)

- Automatización con IA + n8n para asistencia en redacción
- Newsletter (ya preparado en el schema con `NewsletterSubscriber`)
- Publicación automática
- Versión PWA
