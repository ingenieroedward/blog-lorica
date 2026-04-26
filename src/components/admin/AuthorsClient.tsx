'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from './ImageUpload'

type Author = {
  id: number
  name: string
  slug: string
  bio: string
  shortBio: string
  email: string
  image: string
  twitter: string
  instagram: string
  postCount: number
}

const FIELD = 'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300'
const STYLE_BORDER = { borderColor: 'var(--color-border)' }
const emptyForm = { name: '', slug: '', bio: '', shortBio: '', email: '', image: '', twitter: '', instagram: '' }

export function AuthorsClient({ initialAuthors }: { initialAuthors: Author[] }) {
  const router = useRouter()
  const [authors, setAuthors] = useState(initialAuthors)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  function f(key: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function startEdit(a: Author) {
    setEditing(a.id)
    setForm({ name: a.name, slug: a.slug, bio: a.bio, shortBio: a.shortBio, email: a.email, image: a.image, twitter: a.twitter, instagram: a.instagram })
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        const res = await fetch(`/api/admin/authors/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        if (!res.ok) throw new Error((await res.json()).error)
        const updated = await res.json()
        setAuthors((prev) => prev.map((a) => a.id === editing ? { ...a, ...updated } : a))
        setEditing(null)
      } else {
        const res = await fetch('/api/admin/authors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        if (!res.ok) throw new Error((await res.json()).error)
        const created = await res.json()
        setAuthors((prev) => [...prev, { ...created, postCount: 0 }])
      }
      setForm(emptyForm)
      setShowForm(false)
      router.refresh()
    } catch (err) { setError(String(err)) } finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Eliminar este autor?')) return
    setDeleting(id)
    await fetch(`/api/admin/authors/${id}`, { method: 'DELETE' })
    setAuthors((prev) => prev.filter((a) => a.id !== id))
    setDeleting(null)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          + Nuevo autor
        </button>
      </div>

      {/* Author cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border p-5" style={STYLE_BORDER}>
            <div className="flex items-start gap-3 mb-3">
              {a.image ? (
                <img src={a.image} alt={a.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                  {a.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: '#111827' }}>{a.name}</p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>{a.postCount} artículos</p>
              </div>
            </div>
            <p className="text-xs line-clamp-2 mb-3" style={{ color: '#6B7280' }}>{a.shortBio}</p>
            <div className="flex gap-2">
              <button onClick={() => startEdit(a)} className="text-xs font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>Editar</button>
              <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id} className="text-xs text-red-500 hover:underline disabled:opacity-50">
                {deleting === a.id ? '…' : 'Borrar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal-like form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: '#111827' }}>{editing ? 'Editar autor' : 'Nuevo autor'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Nombre *</label>
                <input required type="text" value={form.name} onChange={(e) => f('name', e.target.value)} className={FIELD} style={STYLE_BORDER} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Bio (completa) *</label>
                <textarea required rows={4} value={form.bio} onChange={(e) => f('bio', e.target.value)} className={`${FIELD} resize-none`} style={STYLE_BORDER} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Bio corta (máx 200 char) *</label>
                <input required type="text" maxLength={200} value={form.shortBio} onChange={(e) => f('shortBio', e.target.value)} className={FIELD} style={STYLE_BORDER} />
              </div>
              <ImageUpload value={form.image} onChange={(url) => f('image', url)} label="Foto de perfil" />
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Email</label>
                <input type="email" value={form.email} onChange={(e) => f('email', e.target.value)} className={FIELD} style={STYLE_BORDER} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Twitter (sin @)</label>
                  <input type="text" value={form.twitter} onChange={(e) => f('twitter', e.target.value)} className={FIELD} style={STYLE_BORDER} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Instagram (sin @)</label>
                  <input type="text" value={form.instagram} onChange={(e) => f('instagram', e.target.value)} className={FIELD} style={STYLE_BORDER} />
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: 'var(--color-primary)' }}>
                  {saving ? '…' : editing ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm border" style={STYLE_BORDER}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
