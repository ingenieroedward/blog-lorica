'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from './ImageUpload'

type Category = {
  id: number
  name: string
  slug: string
  description: string
  color: string
  postCount: number
}

const FIELD = 'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300'
const STYLE_BORDER = { borderColor: 'var(--color-border)' }

const emptyForm = { name: '', slug: '', description: '', color: '#2D6A8F' }

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [error, setError] = useState('')

  function startEdit(cat: Category) {
    setEditing(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, color: cat.color })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        const res = await fetch(`/api/admin/categories/${editing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error((await res.json()).error)
        const updated = await res.json()
        setCategories((prev) => prev.map((c) => c.id === editing ? { ...c, ...updated } : c))
        setEditing(null)
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error((await res.json()).error)
        const created = await res.json()
        setCategories((prev) => [...prev, { ...created, postCount: 0 }])
      }
      setForm(emptyForm)
      router.refresh()
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Eliminar esta categoría?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      setCategories((prev) => prev.filter((c) => c.id !== id))
      router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      {/* List */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={STYLE_BORDER}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ ...STYLE_BORDER, backgroundColor: '#F9FAFB' }}>
              <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: '#6B7280' }}>Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide hidden sm:table-cell" style={{ color: '#6B7280' }}>Artículos</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={STYLE_BORDER}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <p className="font-medium" style={{ color: '#111827' }}>{cat.name}</p>
                  </div>
                  <p className="text-xs mt-0.5 pl-5" style={{ color: '#9CA3AF' }}>/categoria/{cat.slug}</p>
                </td>
                <td className="px-4 py-3.5 text-sm hidden sm:table-cell" style={{ color: '#6B7280' }}>{cat.postCount}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => startEdit(cat)} className="text-xs font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>Editar</button>
                    <button onClick={() => handleDelete(cat.id)} disabled={deleting === cat.id} className="text-xs text-red-500 hover:underline disabled:opacity-50">
                      {deleting === cat.id ? '…' : 'Borrar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border p-5" style={STYLE_BORDER}>
        <h3 className="font-semibold mb-4" style={{ color: '#111827' }}>
          {editing ? 'Editar categoría' : 'Nueva categoría'}
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Nombre</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={FIELD} style={STYLE_BORDER} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={FIELD} style={STYLE_BORDER} placeholder="Auto-generado" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Descripción</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${FIELD} resize-none`} style={STYLE_BORDER} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg border cursor-pointer" style={STYLE_BORDER} />
              <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={`${FIELD} w-28`} style={STYLE_BORDER} />
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: 'var(--color-primary)' }}>
              {saving ? '…' : editing ? 'Actualizar' : 'Crear'}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(emptyForm) }} className="px-4 py-2.5 rounded-lg text-sm border" style={STYLE_BORDER}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
