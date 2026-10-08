export interface RunEvent {
  id: string
  name: string
  /** ISO-datum, bv. 2026-10-10 */
  date: string
  time?: string | null
  place: string
  province: string
  categories: string[]
  /** afstanden in km */
  distances: number[]
  priceMin?: number | null
  priceMax?: number | null
  free: boolean
  kids: boolean
  relay: boolean
  certified: boolean
  featured: boolean
  website?: string | null
  description?: string | null
  organizer?: string | null
  image?: string | null
  edition?: string | null
  lat?: number | null
  lng?: number | null
  cancelled?: boolean
}

export type DistanceBucket = '' | '5' | '10' | '15' | '21.1' | '42.2' | 'ultra'

export interface EventFilters {
  type: string
  province: string
  region: string
  distance: DistanceBucket
  dateFrom: string
  dateTo: string
  kids: boolean
  relay: boolean
  free: boolean
  certified: boolean
  postcode: string
  radius: number
  query: string
}

export const EMPTY_FILTERS: EventFilters = {
  type: '',
  province: '',
  region: '',
  distance: '',
  dateFrom: '',
  dateTo: '',
  kids: false,
  relay: false,
  free: false,
  certified: false,
  postcode: '',
  radius: 0,
  query: '',
}
