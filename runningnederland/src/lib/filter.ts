import type { EventFilters, RunEvent } from './types'
import { REGIONS } from '@/data/provinces'
import { distanceKm } from './geo'

const BUCKET_MAX: Record<string, number> = { '5': 5, '10': 10, '15': 15, '21.1': 21.1, '42.2': 42.2 }

export function matchesDistance(e: RunEvent, bucket: string): boolean {
  if (!bucket) return true
  if (bucket === 'ultra') return e.distances.some((d) => d > 42.2)
  const max = BUCKET_MAX[bucket]
  return e.distances.some((d) => d <= max)
}

export function applyFilters(list: RunEvent[], f: EventFilters, origin?: { lat: number; lng: number } | null): RunEvent[] {
  const q = f.query.trim().toLowerCase()
  const region = REGIONS.find((r) => r.id === f.region)
  return list.filter((e) => {
    if (f.type && !e.categories.includes(f.type)) return false
    if (f.province && e.province !== f.province) return false
    if (region && !region.provinces.includes(e.province)) return false
    if (!matchesDistance(e, f.distance)) return false
    if (f.dateFrom && e.date < f.dateFrom) return false
    if (f.dateTo && e.date > f.dateTo) return false
    if (f.kids && !e.kids) return false
    if (f.relay && !e.relay && !e.categories.includes('Estafette')) return false
    if (f.free && !e.free) return false
    if (f.certified && !e.certified) return false
    if (q && !`${e.name} ${e.place}`.toLowerCase().includes(q)) return false
    if (origin && f.radius > 0) {
      if (e.lat == null || e.lng == null) return false
      if (distanceKm(origin, { lat: e.lat, lng: e.lng }) > f.radius) return false
    }
    return true
  })
}

export function sortEvents(list: RunEvent[], by: 'date' | 'name'): RunEvent[] {
  return [...list].sort((a, b) =>
    by === 'name' ? a.name.localeCompare(b.name, 'nl') : a.date.localeCompare(b.date) || a.name.localeCompare(b.name, 'nl'),
  )
}
