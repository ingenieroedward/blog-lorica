'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const POSITIONS = [
  'HEADER', 'SIDEBAR_TOP', 'SIDEBAR_BOTTOM',
  'IN_CONTENT_1', 'IN_CONTENT_2', 'FOOTER',
] as const

type AdPosition = typeof POSITIONS[number]

type Ad = {
  id: number
  name: string
  position: AdPosition
  size: string
  advertiser: string | null
  imageUrl: string | null
  linkUrl: string | null
  altText: string | null
  adCode: string | null
  active: boolean
  impressions: number
  clicks: number
  startsAt: string | null
  endsAt: string | null
}

const FIELD = 'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300'
const SB = { borderColor: 'var(--color-border)' }

const emptyForm = {
  name: '', position: 'HEADER' as AdPosition, size: '728x90',
  advertiser: '', imageUrl: '', linkUrl: '', altText: '', adCode: '',
  active: false, startsAt: '', endsAt: '',
}

const POSITION_LABELS: Record<AdPosition, string> = {
  HEADER:          'Cabecera (728×90)',
  SIDEBAR_TOP:     'Sidebar — arriba (300×250)',
  SIDEBAR_BOTTOM:  'Sidebar — abajo (300×600)',
  IN_CONTENT_1:    'En contenido — 1 (responsive)',
  IN_CONTENT_2:    'En contenido — 2 (responsive)',
  FOOTER:          'Pie de página (728×90)',
}

const SIZE_DEFAULTS: Record<AdPosition, string> = {
  HEADER:         '728x90',
  SIDEBAR_TOP:    '300x250',
  SIDEBAR_BOTTOM: '300x600',
  IN_CONTENT_1:   'responsive',
  IN_CONTENT_2:   'responsive',
  FOOTER:         '728x90',
}

function ctr(imp: number, clk: number) {
  if (!imp) return '—'
  return `${((clk / imp) * 100).toFixed(1)}%`
}

export function AdsClient({ initialAds }: { initialAds: Ad[] }) {
  const router = useRouter()
  const [ads, setAds] = useState(initialAds)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<number | null>(null)
  const [error, setError] = useState('')

  function f(key: keyof typeof emptyForm, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function startEdit(ad: Ad) {
    setEditing(ad.id)
    setForm({
      name: ad.name, position: ad.position, size: ad.size,
      advertiser: ad.advertiser ?? '', imageUrl: ad.imageUrl ?? '',
      linkUrl: ad.linkUrl ?? '', altText: ad.altText ?? '',
      adCode: ad.adCode ?? '', active: ad.active,
      startsAt: ad.startsAt ?? '', endsAt: ad.endsAt ?? '',
    })
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        startsAt: form.startsAt || undefined,
        endsAt:   form.endsAt   || undefined,
        advertiser: form.advertiser || undefined,
        imageUrl:   form.imageUrl   || undefined,
        linkUrl:    form.linkUrl    || undefined,
        altText:    form.altText    || undefined,
        adCode:     form.adCode     || undefined,
      }
      if (editing) {
        const res = await fetch(`/api/admin/ads/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error((await res.json()).error)
        const updated = await res.json()
        setAds((prev) => prev.map((a) => a.id === editing ? updated : a))
        setEditing(null)
      } else {
        const res = await fetch('/api/admin/ads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!res.ok) throw new Error((await res.json()).error)
        const created = await res.json()
        setAds((prev) => [...prev, created])
      }
      setShowForm(false)
      setForm(emptyForm)
      router.refresh()
    } catch (err) { setError(String(err)) } finally { setSaving(false) }
  }

  async function handleToggle(ad: Ad) {
    setToggling(ad.id)
    try {
      const res = await fetch(`/api/admin/ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !ad.active }),
      })
      if (res.ok) {
        const updated = await res.json()
        setAds((prev) => prev.map((a) => a.id === ad.id ? updated : a))
      }
    } finally { setToggling(null) }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('¿Eliminar este anuncio?')) return
    await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' })
    setAds((prev) => prev.filter((a) => a.id !== id))
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
          + Nuevo anuncio
        </button>
      </div>

      {/* Metrics table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={SB}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ ...SB, backgroundColor: '#F9FAFB' }}>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Nombre / Posición</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide hidden md:table-cell" style={{ color: '#6B7280' }}>Advertiser</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style={{ color: '#6B7280' }}>Impresiones</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style={{ color: '#6B7280' }}>Clics</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide hidden lg:table-cell" style={{ color: '#6B7280' }}>CTR</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={SB}>
                <td className="px-5 py-3.5">
                  <p className="font-medium" style={{ color: '#111827' }}>{ad.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{POSITION_LABELS[ad.position]}</p>
                </td>
                <td className="px-4 py-3.5 text-xs hidden md:table-cell" style={{ color: '#6B7280' }}>
                  {ad.advertiser ?? '—'}
                </td>
                <td className="px-4 py-3.5 text-sm font-medium hidden lg:table-cell" style={{ color: '#374151' }}>
                  {ad.impressions.toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3.5 text-sm hidden lg:table-cell" style={{ color: '#374151' }}>
                  {ad.clicks.toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3.5 text-sm hidden lg:table-cell" style={{ color: ad.impressions ? '#059669' : '#9CA3AF' }}>
                  {ctr(ad.impressions, ad.clicks)}
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => handleToggle(ad)}
                    disabled={toggling === ad.id}
                    className="relative w-10 h-6 rounded-full transition-colors disabled:opacity-50"
                    style={{ backgroundColor: ad.active ? 'var(--color-primary)' : '#D1D5DB' }}
                    title={ad.active ? 'Activo — clic para desactivar' : 'Inactivo — clic para activar'}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
                      style={{ left: ad.active ? '22px' : '4px' }}
                    />
                  </button>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => startEdit(ad)} className="text-xs font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>Editar</button>
                    <button onClick={() => handleDelete(ad.id)} className="text-xs text-red-500 hover:underline">Borrar</button>
                  </div>
                </td>
              </tr>
            ))}
            {ads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm" style={{ color: '#9CA3AF' }}>
                  No hay anuncios configurados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: '#111827' }}>{editing ? 'Editar anuncio' : 'Nuevo anuncio'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Nombre interno *</label>
                  <input required type="text" value={form.name} onChange={(e) => f('name', e.target.value)} className={FIELD} style={SB} placeholder="Ej: Banner header Q1 2026" />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Posición *</label>
                  <select
                    value={form.position}
                    onChange={(e) => {
                      const pos = e.target.value as AdPosition
                      f('position', pos)
                      f('size', SIZE_DEFAULTS[pos])
                    }}
                    className={FIELD} style={SB}
                  >
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>{POSITION_LABELS[p]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Tamaño</label>
                  <input type="text" value={form.size} onChange={(e) => f('size', e.target.value)} className={FIELD} style={SB} />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Anunciante</label>
                  <input type="text" value={form.advertiser} onChange={(e) => f('advertiser', e.target.value)} className={FIELD} style={SB} />
                </div>
              </div>

              {/* Type: AdSense code OR direct image */}
              <div className="rounded-xl border p-4 space-y-3" style={SB}>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Contenido del anuncio</p>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Código HTML / AdSense <span className="normal-case font-normal">(si tienes código de AdSense, pégalo aquí)</span></label>
                  <textarea
                    rows={4}
                    value={form.adCode}
                    onChange={(e) => f('adCode', e.target.value)}
                    className={`${FIELD} font-mono text-xs resize-none`}
                    style={SB}
                    placeholder={'<ins class="adsbygoogle"\n  data-ad-client="ca-pub-XXXXX"\n  data-ad-slot="YYYYY"\n  data-ad-format="auto" />'}
                  />
                </div>

                <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>— o para anuncio directo (imagen + enlace) —</p>

                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>URL de la imagen</label>
                  <input type="text" value={form.imageUrl} onChange={(e) => f('imageUrl', e.target.value)} className={FIELD} style={SB} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>URL de destino</label>
                  <input type="text" value={form.linkUrl} onChange={(e) => f('linkUrl', e.target.value)} className={FIELD} style={SB} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Alt de la imagen</label>
                  <input type="text" value={form.altText} onChange={(e) => f('altText', e.target.value)} className={FIELD} style={SB} />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Fecha inicio</label>
                  <input type="datetime-local" value={form.startsAt} onChange={(e) => f('startsAt', e.target.value)} className={FIELD} style={SB} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>Fecha fin</label>
                  <input type="datetime-local" value={form.endsAt} onChange={(e) => f('endsAt', e.target.value)} className={FIELD} style={SB} />
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className="relative w-10 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: form.active ? 'var(--color-primary)' : '#D1D5DB' }}
                >
                  <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform" style={{ left: form.active ? '22px' : '4px' }} />
                </div>
                <input type="checkbox" checked={form.active} onChange={(e) => f('active', e.target.checked)} className="sr-only" />
                <span className="text-sm font-medium" style={{ color: '#374151' }}>
                  {form.active ? 'Activo' : 'Inactivo'}
                </span>
              </label>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: 'var(--color-primary)' }}>
                  {saving ? '…' : editing ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm border" style={SB}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
