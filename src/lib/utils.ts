export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ')
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / 200))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(
    typeof date === 'string' ? new Date(date) : date,
  )
}
