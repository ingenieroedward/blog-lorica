import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Enums ────────────────────────────────────────────────────

export const adPositionEnum = pgEnum('ad_position', [
  'HEADER',
  'SIDEBAR_TOP',
  'SIDEBAR_BOTTOM',
  'IN_CONTENT_1',
  'IN_CONTENT_2',
  'FOOTER',
])

// ─── Autores ─────────────────────────────────────────────────

export const authors = pgTable(
  'authors',
  {
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
  },
  (t) => [index('author_slug_idx').on(t.slug)],
)

export const authorsRelations = relations(authors, ({ many }) => ({
  posts: many(posts),
}))

// ─── Categorías ───────────────────────────────────────────────

export const categories = pgTable(
  'categories',
  {
    id:          serial('id').primaryKey(),
    name:        varchar('name', { length: 100 }).notNull(),
    slug:        varchar('slug', { length: 120 }).notNull().unique(),
    description: text('description'),
    color:       varchar('color', { length: 7 }),
    image:       varchar('image', { length: 500 }),
    metaTitle:   varchar('meta_title', { length: 70 }),
    metaDesc:    varchar('meta_desc', { length: 160 }),
    createdAt:   timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('category_slug_idx').on(t.slug)],
)

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}))

// ─── Tags ────────────────────────────────────────────────────

export const tags = pgTable(
  'tags',
  {
    id:        serial('id').primaryKey(),
    name:      varchar('name', { length: 100 }).notNull(),
    slug:      varchar('slug', { length: 120 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('tag_slug_idx').on(t.slug)],
)

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}))

// ─── Posts ────────────────────────────────────────────────────

export const posts = pgTable(
  'posts',
  {
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
    readingTime:   integer('reading_time'),
    authorId:      integer('author_id').notNull().references(() => authors.id),
    categoryId:    integer('category_id').notNull().references(() => categories.id),
    createdAt:     timestamp('created_at').defaultNow().notNull(),
    updatedAt:     timestamp('updated_at').defaultNow().notNull().$onUpdateFn(() => new Date()),
  },
  (t) => [
    index('post_slug_idx').on(t.slug),
    index('post_published_idx').on(t.published, t.publishedAt),
    index('post_category_idx').on(t.categoryId, t.published),
    index('post_author_idx').on(t.authorId),
  ],
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  author:       one(authors,    { fields: [posts.authorId],   references: [authors.id] }),
  category:     one(categories, { fields: [posts.categoryId], references: [categories.id] }),
  postTags:     many(postTags),
  views:        many(postViews),
  relatedTo:    many(postRelations, { relationName: 'sourcePost' }),
  relatedFrom:  many(postRelations, { relationName: 'targetPost' }),
}))

// ─── Post ↔ Tag ───────────────────────────────────────────────

export const postTags = pgTable(
  'post_tags',
  {
    postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    tagId:  integer('tag_id').notNull().references(() => tags.id,  { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.postId, t.tagId] }),
    index('post_tags_tag_idx').on(t.tagId),
  ],
)

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag:  one(tags,  { fields: [postTags.tagId],  references: [tags.id] }),
}))

// ─── Post ↔ Post (artículos relacionados) ─────────────────────

export const postRelations = pgTable(
  'post_relations',
  {
    sourcePostId: integer('source_post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    targetPostId: integer('target_post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    order:        integer('order').default(0).notNull(),
  },
  (t) => [primaryKey({ columns: [t.sourcePostId, t.targetPostId] })],
)

export const postRelationsRelations = relations(postRelations, ({ one }) => ({
  sourcePost: one(posts, { relationName: 'sourcePost', fields: [postRelations.sourcePostId], references: [posts.id] }),
  targetPost: one(posts, { relationName: 'targetPost', fields: [postRelations.targetPostId], references: [posts.id] }),
}))

// ─── Vistas ───────────────────────────────────────────────────

export const postViews = pgTable(
  'post_views',
  {
    id:       serial('id').primaryKey(),
    postId:   integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    date:     varchar('date', { length: 10 }).notNull(),
    viewedAt: timestamp('viewed_at').defaultNow().notNull(),
  },
  (t) => [
    index('post_views_post_idx').on(t.postId),
    index('post_views_date_idx').on(t.postId, t.date),
  ],
)

export const postViewsRelations = relations(postViews, ({ one }) => ({
  post: one(posts, { fields: [postViews.postId], references: [posts.id] }),
}))

// ─── Slots publicitarios ──────────────────────────────────────

export const adSlots = pgTable(
  'ad_slots',
  {
    id:          serial('id').primaryKey(),
    name:        varchar('name', { length: 100 }).notNull(),
    position:    adPositionEnum('position').notNull(),
    size:        varchar('size', { length: 50 }).notNull(),
    advertiser:  varchar('advertiser', { length: 200 }),
    imageUrl:    varchar('image_url', { length: 500 }),
    linkUrl:     varchar('link_url', { length: 500 }),
    altText:     varchar('alt_text', { length: 200 }),
    adCode:      text('ad_code'),
    active:      boolean('active').default(false).notNull(),
    startsAt:    timestamp('starts_at'),
    endsAt:      timestamp('ends_at'),
    impressions: integer('impressions').default(0).notNull(),
    clicks:      integer('clicks').default(0).notNull(),
    categoryId:  integer('category_id'),
    createdAt:   timestamp('created_at').defaultNow().notNull(),
    updatedAt:   timestamp('updated_at').defaultNow().notNull().$onUpdateFn(() => new Date()),
  },
  (t) => [index('ad_slot_position_idx').on(t.position, t.active)],
)

// ─── Configuración del sitio ──────────────────────────────────

export const siteSettings = pgTable('site_settings', {
  key:       varchar('key', { length: 100 }).primaryKey(),
  value:     text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdateFn(() => new Date()),
})

// ─── Newsletter ───────────────────────────────────────────────

export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id:           serial('id').primaryKey(),
    email:        varchar('email', { length: 200 }).notNull().unique(),
    name:         varchar('name', { length: 100 }),
    active:       boolean('active').default(true).notNull(),
    subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
    confirmedAt:  timestamp('confirmed_at'),
  },
  (t) => [index('newsletter_active_idx').on(t.active)],
)

// ─── Tipos inferidos ──────────────────────────────────────────

export type Author   = typeof authors.$inferSelect
export type Category = typeof categories.$inferSelect
export type Tag      = typeof tags.$inferSelect
export type Post     = typeof posts.$inferSelect
export type AdSlot   = typeof adSlots.$inferSelect
export type AdPosition = typeof adPositionEnum.enumValues[number]
