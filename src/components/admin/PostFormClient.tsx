'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ImageUpload } from './ImageUpload'
import { generateSlug } from '@/lib/utils'

const PostEditor = dynamic(() => import('./PostEditor').then((m) => ({ default: m.PostEditor })), {
  ssr: false,
  loading: () => <div className="min-h-[400px] animate-pulse rounded-xl" style={{ backgroundColor: '#F3F4F6' }} />,
})

type Tag     = { id: number; name: string }
type Cat     = { id: number; name: string; color: string | null }
type Author  = { id: number; name: string }

type Props = {
  mode: 'create' | 'edit'
  postId?: number
  initialData?: {
    title: string
    slug: string
    content: string
    excerpt: string
    coverImage: string
    coverImageAlt: string
    metaTitle: string
    metaDesc: string
    published: boolean
    authorId: number
    categoryId: number
    tagIds: number[]
  }
  categories: Cat[]
  authors: Author[]
  allTags: Tag[]
}

const FIELD = 'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300'
const STYLE_BORDER = { borderColor: 'var(--color-border)' }
const LABEL = 'block text-xs font-semibold uppercase tracking-wide mb-1'

export function PostFormClient({ mode, postId, initialData, categories, authors, allTags }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugManual, setSlugManual] = useState(mode === 'edit')

  const [title, setTitle]             = useState(initialData?.title ?? '')
  const [slug, setSlug]               = useState(initialData?.slug ?? '')
  const [content, setContent]         = useState(initialData?.content ?? '')
  const [excerpt, setExcerpt]         = useState(initialData?.excerpt ?? '')
  const [coverImage, setCoverImage]   = useState(initialData?.coverImage ?? '')
  const [coverImageAlt, setCoverImageAlt] = useState(initialData?.coverImageAlt ?? '')
  const [metaTitle, setMetaTitle]     = useState(initialData?.metaTitle ?? '')
  const [metaDesc, setMetaDesc]       = useState(initialData?.metaDesc ?? '')
  const [published, setPublished]     = useState(initialData?.published ?? false)
  const [authorId, setAuthorId]       = useState<number>(initialData?.authorId ?? authors[0]?.id ?? 0)
  const [categoryId, setCategoryId]   = useState<number>(initialData?.categoryId ?? categories[0]?.id ?? 0)
  const [tagIds, setTagIds]           = useState<number[]>(initialData?.tagIds ?? [])
  const [newTag, setNewTag]           = useState('')
  const [availableTags, setAvailableTags] = useState<Tag[]>(allTags)

  // Auto-slug from title
  useEffect(() => {
    if (!slugManual && title) setSlug(generateSlug(title))
  }, [title, slugManual])

  function toggleTag(id: number) {
    setTagIds((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id])
  }

  async function createTag() {
    if (!newTag.trim()) return
    const res = await fetch('/api/admin/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTag.trim() }),
    })
    if (res.ok) {
      const tag = await res.json()
      setAvailableTags((prev) => [...prev, tag])
      setTagIds((prev) => [...prev, tag.id])
      setNewTag('')
    }
  }

  async function handleEditorImageInsert() {
    const url = window.prompt('URL de la imagen:')
    if (url) {
      // This would need a reference to the editor — handled via custom event or ref
      // For now, user can paste the URL directly into the editor
    }
  }

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  async function handleSubmit(e: React.FormEvent, asDraft = false) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title, slug, content, excerpt,
      coverImage:    coverImage || undefined,
      coverImageAlt: coverImageAlt || undefined,
      metaTitle:     metaTitle || undefined,
      metaDesc:      metaDesc || undefined,
      published:     asDraft ? false : published,
      authorId, categoryId, tagIds,
    }

    try {
      const url = mode === 'edit' ? `/api/admin/posts/${postId}` : '/api/admin/posts'
      const method = mode === 'edit' ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al guardar')

      router.push('/admin/posts')
      router.refresh()
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-6 items-start">

      {/* ── Main column ───────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Title */}
        <div>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del artículo"
            className="w-full px-4 py-3 text-2xl font-bold border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ borderColor: 'var(--color-border)', fontFamily: 'var(--font-serif)' }}
          />
        </div>

        {/* Slug */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Slug / URL</label>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: '#9CA3AF' }}>/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlugManual(true); setSlug(e.target.value) }}
              className={`${FIELD} flex-1`}
              style={STYLE_BORDER}
              required
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Extracto</label>
          <textarea
            rows={3}
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Descripción corta que aparece en las tarjetas y meta description"
            className={`${FIELD} resize-none`}
            style={STYLE_BORDER}
          />
          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{excerpt.length} / 300 caracteres</p>
        </div>

        {/* Cover image */}
        <ImageUpload
          value={coverImage}
          onChange={setCoverImage}
          label="Imagen de portada"
          hint="Recomendado: 1200×630 px, formato .webp o .jpg"
        />
        {coverImage && (
          <div>
            <label className={LABEL} style={{ color: '#6B7280' }}>Alt de la imagen</label>
            <input
              type="text"
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              placeholder="Descripción de la imagen para accesibilidad"
              className={FIELD}
              style={STYLE_BORDER}
            />
          </div>
        )}

        {/* Editor */}
        <div>
          <label className={LABEL} style={{ color: '#6B7280' }}>Contenido</label>
          <PostEditor
            value={content}
            onChange={handleContentChange}
            onImageInsert={handleEditorImageInsert}
          />
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {saving ? 'Guardando…' : published ? 'Publicar' : 'Guardar como borrador'}
          </button>
          {!published && (
            <button
              type="button"
              disabled={saving}
              onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-gray-50 disabled:opacity-60"
              style={{ borderColor: 'var(--color-border)', color: '#374151' }}
            >
              Solo guardar borrador
            </button>
          )}
        </div>
      </div>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-72 shrink-0 sticky top-6 space-y-4">

        {/* Publish */}
        <div className="p-4 rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B7280' }}>Publicación</h3>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div
              className="relative w-10 h-6 rounded-full transition-colors"
              style={{ backgroundColor: published ? 'var(--color-primary)' : '#D1D5DB' }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
                style={{ left: published ? '22px' : '4px' }}
              />
            </div>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="sr-only"
            />
            <span className="text-sm font-medium" style={{ color: '#374151' }}>
              {published ? 'Publicado' : 'Borrador'}
            </span>
          </label>
        </div>

        {/* Category */}
        <div className="p-4 rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>
            Categoría
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className={`${FIELD}`}
            style={STYLE_BORDER}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Author */}
        <div className="p-4 rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>
            Autor
          </label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(Number(e.target.value))}
            className={FIELD}
            style={STYLE_BORDER}
            required
          >
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="p-4 rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#6B7280' }}>Tags</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {availableTags.map((tag) => {
              const active = tagIds.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="text-xs px-2.5 py-1 rounded-full border transition-colors"
                  style={{
                    borderColor:     active ? 'var(--color-primary)' : 'var(--color-border)',
                    color:           active ? 'var(--color-primary)' : '#6B7280',
                    backgroundColor: active ? '#EFF6FF' : 'transparent',
                  }}
                >
                  #{tag.name}
                </button>
              )
            })}
          </div>
          <div className="flex gap-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); createTag() } }}
              placeholder="Nuevo tag"
              className="flex-1 px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
              style={STYLE_BORDER}
            />
            <button
              type="button"
              onClick={createTag}
              className="px-2.5 py-1.5 text-xs border rounded-lg hover:bg-gray-50"
              style={STYLE_BORDER}
            >+</button>
          </div>
        </div>

        {/* SEO */}
        <div className="p-4 rounded-xl border bg-white" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B7280' }}>SEO</h3>
          <div className="space-y-3">
            <div>
              <label className={LABEL} style={{ color: '#9CA3AF' }}>Meta título <span className="normal-case">(opcional)</span></label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title}
                className={`${FIELD} text-xs`}
                style={STYLE_BORDER}
                maxLength={70}
              />
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{metaTitle.length}/70</p>
            </div>
            <div>
              <label className={LABEL} style={{ color: '#9CA3AF' }}>Meta descripción <span className="normal-case">(opcional)</span></label>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder={excerpt}
                className={`${FIELD} text-xs resize-none`}
                style={STYLE_BORDER}
                maxLength={160}
              />
              <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{metaDesc.length}/160</p>
            </div>
          </div>
        </div>

      </aside>
    </form>
  )
}
