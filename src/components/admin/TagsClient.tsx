'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tag = { id: number; name: string; slug: string; postCount: number }

const FIELD = 'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300'
const STYLE_BORDER = { borderColor: 'var(--color-border)' }
const emptyForm = { name: '', slug: '' }

export function TagsClient({ initialTags }: { initialTags: Tag[] }) {
  const router = useRouter()
  const [tags, setTags] = useState(initialTags)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        const res = await fetch(`/api/admin/tags/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        if (!res.ok) throw new Error((await res.json()).error)
        const updated = await res.json()
        setTags((prev) => prev.map((t) => t.id === editing ? { ...t, ...updated } : t))
        setEditing(null)
      } else {
        const res = await fetch('/api/admin/tags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        if (!res.ok) throw new Error((await res.json()).error)
        const created = await res.json()
        setTags((prev) => [...prev, { ...created, postCount: 0 }])
      }
      setForm(emptyForm)
      router.refresh()
    } catch (err) { setError(String(err)) } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Eliminar este tag?')) return
    setDeleting(id)
    await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' })
    setTags((prev) => prev.filter((t) => t.id !== id))
    setDeleting(null)
    router.refresh()
  }

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      <div className="bg-white rounded-2xl border overflow-hidden" style={STYLE_BORDER}>
        <div className="flex flex-wrap gap-2 p-5">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm"
              style={STYLE_BORDER}
            >
              <span style={{ color: '#374151' }}>#{tag.name}</span>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>({tag.postCount})</span>
              <button onClick={() => { setEditing(tag.id); setForm({ name: tag.name, slug: tag.slug }) }} className="text-xs hover:underline ml-1" style={{ color: 'var(--color-primary)' }}>✎</button>
              <button onClick={() => handleDelete(tag.id)} disabled={deleting === tag.id} className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50">✕</button>
            </div>
          ))}
          {tags.length === 0 && <p className="text-sm" style={{ color: '#9CA3AF' }}>No hay tags aún.</p>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-5" style={STYLE_BORDER}>
        <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>{editing ? 'Editar tag' : 'Nuevo tag'}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Nombre</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={FIELD} style={STYLE_BORDER} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={FIELD} style={STYLE_BORDER} placeholder="Auto-generado" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: 'var(--color-primary)' }}>
              {saving ? '…' : editing ? 'Actualizar' : 'Crear'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(emptyForm) }} className="px-4 py-2.5 rounded-lg text-sm border" style={STYLE_BORDER}>Cancelar</button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
