import { lang } from './i18n'

const loc = () => (lang.value === 'en' ? 'en-GB' : 'nl-NL')
const parse = (iso: string) => new Date(iso + 'T12:00:00')

/** "Za 10 okt" */
export function shortDate(iso: string): string {
  const s = parse(iso).toLocaleDateString(loc(), { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\./g, '')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** "zaterdag 10 oktober 2026" */
export function longDate(iso: string): string {
  return parse(iso).toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function km(d: number): string {
  return `${d.toLocaleString('nl-NL', { maximumFractionDigits: 1 })} km`
}

export function distanceList(ds: number[], max = 5): string {
  const sorted = [...ds].sort((a, b) => a - b)
  const shown = sorted.slice(0, max).map(km).join(' · ')
  return sorted.length > max ? `${shown} +${sorted.length - max}` : shown
}

const euro = (n: number) => `€ ${n.toLocaleString('nl-NL', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

export function price(e: { free: boolean; priceMin?: number | null; priceMax?: number | null }, freeLabel = 'Gratis'): string {
  if (e.free) return freeLabel
  if (e.priceMin == null && e.priceMax == null) return ''
  const a = e.priceMin ?? e.priceMax!
  const b = e.priceMax ?? a
  return a === b ? euro(a) : `${euro(a)} – ${euro(b)}`
}
