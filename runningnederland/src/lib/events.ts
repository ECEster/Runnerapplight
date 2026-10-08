import { supabase, EVENTS_TABLE } from './supabase'
import type { RunEvent } from './types'
import { SAMPLE_EVENTS } from '@/data/sample-events'

/**
 * Koppeling tussen de kolommen in Supabase en de velden in de app.
 * Heten jouw kolommen anders? Pas dan alleen deze twee functies aan.
 * Zie supabase/schema.sql voor de verwachte tabel.
 */
type Row = Record<string, unknown>

const num = (v: unknown): number | null => (v === null || v === undefined || v === '' ? null : Number(v))
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : typeof v === 'string' && v ? v.split(/[,;|]/) : [])

export function fromRow(r: Row): RunEvent {
  return {
    id: String(r.id),
    name: String(r.name ?? r.naam ?? ''),
    date: String(r.date ?? r.datum ?? '').slice(0, 10),
    time: (r.start_time ?? r.tijd ?? null) as string | null,
    place: String(r.place ?? r.plaats ?? ''),
    province: String(r.province ?? r.provincie ?? ''),
    categories: arr(r.categories ?? r.soort).map((s) => String(s).trim()).filter(Boolean),
    distances: arr(r.distances ?? r.afstanden).map((d) => Number(String(d).replace(',', '.'))).filter((d) => !Number.isNaN(d)),
    priceMin: num(r.price_min),
    priceMax: num(r.price_max),
    free: Boolean(r.is_free),
    kids: Boolean(r.is_kids),
    relay: Boolean(r.is_relay),
    certified: Boolean(r.is_certified),
    featured: Boolean(r.featured),
    website: (r.website ?? null) as string | null,
    description: (r.description ?? r.omschrijving ?? null) as string | null,
    organizer: (r.organizer ?? r.organisator ?? null) as string | null,
    image: (r.image_url ?? null) as string | null,
    edition: r.editie != null ? String(r.editie) : null,
    lat: num(r.lat),
    lng: num(r.lng),
    cancelled: Boolean(r.cancelled),
  }
}

export function toRow(e: Partial<RunEvent>): Row {
  return {
    name: e.name,
    date: e.date,
    start_time: e.time || null,
    place: e.place,
    province: e.province,
    categories: e.categories ?? [],
    distances: e.distances ?? [],
    price_min: e.priceMin ?? null,
    price_max: e.priceMax ?? null,
    is_free: !!e.free,
    is_kids: !!e.kids,
    is_relay: !!e.relay,
    is_certified: !!e.certified,
    featured: !!e.featured,
    website: e.website || null,
    description: e.description || null,
    organizer: e.organizer || null,
    image_url: e.image || null,
    editie: e.edition || null,
    lat: e.lat ?? null,
    lng: e.lng ?? null,
    cancelled: !!e.cancelled,
  }
}

export const usingSampleData = !supabase

let cache: Promise<RunEvent[]> | null = null

/** Alle evenementen vanaf vandaag (of alles, met includePast). */
export function loadEvents(opts: { includePast?: boolean; fresh?: boolean } = {}): Promise<RunEvent[]> {
  if (opts.fresh) cache = null
  if (!cache) {
    cache = (async () => {
      if (!supabase) return [...SAMPLE_EVENTS]
      const { data, error } = await supabase.from(EVENTS_TABLE).select('*').order('date', { ascending: true })
      if (error) throw error
      return (data ?? []).map(fromRow)
    })()
    cache.catch(() => (cache = null))
  }
  const today = new Date().toISOString().slice(0, 10)
  return cache.then((list) => (opts.includePast ? list : list.filter((e) => e.date >= today)))
}

export async function getEvent(id: string): Promise<RunEvent | undefined> {
  const all = await loadEvents({ includePast: true })
  return all.find((e) => e.id === id)
}

/* ---------- beheer (admin) ---------- */

export async function saveEvent(e: Partial<RunEvent> & { id?: string }): Promise<void> {
  if (!supabase) throw new Error('Supabase is nog niet ingesteld.')
  const row = toRow(e)
  const q = e.id ? supabase.from(EVENTS_TABLE).update(row).eq('id', e.id) : supabase.from(EVENTS_TABLE).insert(row)
  const { error } = await q
  if (error) throw error
  cache = null
}

export async function deleteEvent(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is nog niet ingesteld.')
  const { error } = await supabase.from(EVENTS_TABLE).delete().eq('id', id)
  if (error) throw error
  cache = null
}
