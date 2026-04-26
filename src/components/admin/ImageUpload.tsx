'use client'

import { useRef, useState } from 'react'

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
  hint?: string
}

export function ImageUpload({ value, onChange, label = 'Imagen', hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al subir')
      onChange(data.url)
    } catch (e) {
      setError(String(e))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: '#374151' }}>{label}</label>
      {hint && <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>{hint}</p>}

      {value && (
        <div className="relative mb-2 rounded-lg overflow-hidden aspect-video bg-gray-100">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80"
          >✕</button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... o sube un archivo"
          className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2"
          style={{ borderColor: 'var(--color-border)' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 text-sm border rounded-lg transition-colors hover:bg-gray-50 disabled:opacity-50"
          style={{ borderColor: 'var(--color-border)' }}
        >
          {uploading ? '…' : 'Subir'}
        </button>
      </div>
      {error && <p className="text-xs mt-1 text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
