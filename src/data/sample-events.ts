import type { RunEvent } from '@/lib/types'

// VOORBEELDDATA — wordt alleen gebruikt zolang Supabase nog niet is ingesteld
// (zie README: .env.local). Namen, prijzen en details zijn ter illustratie.
type Sample = Omit<RunEvent, 'kids' | 'relay' | 'certified' | 'free' | 'featured'> & Partial<RunEvent>

const raw: Sample[] = [
  { id: 's1', name: 'LB Chicken Coopertest', date: '2026-10-08', time: '19:00', place: 'Hoogeveen', province: 'Drenthe', categories: ['Coopertest'], distances: [], priceMin: 3, priceMax: 3, lat: 52.72, lng: 6.48 },
  { id: 's2', name: 'Jumbo Reest Run', date: '2026-10-10', time: '10:00', place: 'Meppel', province: 'Drenthe', categories: ['Wegevenement'], distances: [0.4, 1, 1.6, 2.4, 10, 21.1], priceMin: 4.5, priceMax: 18.5, featured: true, lat: 52.7, lng: 6.19 },
  { id: 's3', name: 'Menzis 4Mijl4You', date: '2026-10-10', time: '13:00', place: 'Groningen', province: 'Groningen', categories: ['Wegevenement'], distances: [6.4], priceMin: 14.5, priceMax: 17.5, lat: 53.22, lng: 6.57 },
  { id: 's4', name: 'Reigerboscross', date: '2026-10-10', time: '11:00', place: 'Oranjewoud', province: 'Friesland', categories: ['Crossloop'], distances: [3, 6], priceMin: 5, priceMax: 6, featured: true, lat: 52.95, lng: 5.95 },
  { id: 's5', name: 'RunForestRun Indian Summer Ultra', date: '2026-10-10', time: '07:30', place: 'Hardenberg', province: 'Overijssel', categories: ['Ultrarun', 'Trail'], distances: [25, 50, 75], priceMin: 39, priceMax: 79, lat: 52.58, lng: 6.62 },
  { id: 's6', name: 'Trimloop Appelscha', date: '2026-10-10', time: '10:30', place: 'Appelscha', province: 'Friesland', categories: ['Trail'], distances: [5, 10], priceMin: 7, priceMax: 9, lat: 52.95, lng: 6.35 },
  { id: 's7', name: 'Kids 4 Mijl', date: '2026-10-11', time: '11:00', place: 'Groningen', province: 'Groningen', categories: ['Wegevenement'], distances: [1.6], kids: true, free: true, lat: 53.22, lng: 6.57 },
  { id: 's8', name: 'Menzis 4 Mijl van Groningen', date: '2026-10-11', time: '13:30', place: 'Groningen', province: 'Groningen', categories: ['Wegevenement'], distances: [6.4], priceMin: 19.5, priceMax: 24.5, certified: true, featured: true, lat: 53.22, lng: 6.57 },
  { id: 's9', name: 'Drentse Heideloop', date: '2026-10-17', time: '10:00', place: 'Dwingeloo', province: 'Drenthe', categories: ['Trail'], distances: [8, 15, 21.1], priceMin: 12, priceMax: 22, lat: 52.83, lng: 6.37 },
  { id: 's10', name: 'Boerbos Cross', date: '2026-10-17', time: '10:30', place: 'Rolde', province: 'Drenthe', categories: ['Crossloop'], distances: [4.5, 9], priceMin: 6, priceMax: 8, lat: 52.98, lng: 6.65 },
  { id: 's11', name: 'Strontraceloop', date: '2026-10-17', time: '14:00', place: 'Workum', province: 'Friesland', categories: ['Wegevenement'], distances: [7.3, 15.3], priceMin: 9, priceMax: 12, lat: 52.98, lng: 5.45 },
  { id: 's12', name: 'Parkrun Stadspark', date: '2026-10-18', time: '09:00', place: 'Groningen', province: 'Groningen', categories: ['Parkloop'], distances: [5], free: true, lat: 53.2, lng: 6.54 },
  { id: 's13', name: 'Estafette rond het Paterswoldsemeer', date: '2026-10-24', time: '11:00', place: 'Haren', province: 'Groningen', categories: ['Estafette'], distances: [21.1], relay: true, priceMin: 40, priceMax: 40, lat: 53.17, lng: 6.6 },
  { id: 's14', name: 'Lauwersmeer Halve Marathon', date: '2026-10-25', time: '11:00', place: 'Lauwersoog', province: 'Groningen', categories: ['Wegevenement'], distances: [5, 10, 21.1], priceMin: 10, priceMax: 25, certified: true, lat: 53.4, lng: 6.21 },
  { id: 's15', name: 'Kidsrun Leeuwarden', date: '2026-10-25', time: '10:00', place: 'Leeuwarden', province: 'Friesland', categories: ['Fun Run'], distances: [1, 2], kids: true, priceMin: 2.5, priceMax: 2.5, lat: 53.2, lng: 5.8 },
  { id: 's16', name: 'Amsterdam Marathon', date: '2026-10-18', time: '09:30', place: 'Amsterdam', province: 'Noord-Holland', categories: ['Marathon'], distances: [8, 21.1, 42.2], priceMin: 39, priceMax: 115, certified: true, lat: 52.34, lng: 4.86 },
  { id: 's17', name: 'Zevenheuvelenloop', date: '2026-11-15', time: '12:00', place: 'Nijmegen', province: 'Gelderland', categories: ['Wegevenement'], distances: [15], priceMin: 29, priceMax: 29, certified: true, lat: 51.82, lng: 5.86 },
  { id: 's18', name: 'Sylvestercross', date: '2026-12-31', time: '11:00', place: 'Soest', province: 'Utrecht', categories: ['Crossloop'], distances: [3, 6, 10], priceMin: 8, priceMax: 14, lat: 52.17, lng: 5.29 },
  { id: 's19', name: 'Midwinter Trail Schoorl', date: '2027-01-10', time: '10:00', place: 'Schoorl', province: 'Noord-Holland', categories: ['Trail'], distances: [12, 24, 36], priceMin: 22, priceMax: 38, lat: 52.7, lng: 4.69 },
  { id: 's20', name: 'Kerstloop Maastricht', date: '2026-12-20', time: '13:00', place: 'Maastricht', province: 'Limburg', categories: ['Fun Run'], distances: [5], priceMin: 12.5, priceMax: 12.5, lat: 50.85, lng: 5.69 },
  { id: 's21', name: 'Veluwe Survival Run', date: '2026-11-07', time: '09:00', place: 'Apeldoorn', province: 'Gelderland', categories: ['Survival Run'], distances: [6, 12], priceMin: 35, priceMax: 45, lat: 52.21, lng: 5.97 },
  { id: 's22', name: 'Bevrijdingsloop Zuidbroek', date: '2026-11-01', time: '10:00', place: 'Zuidbroek', province: 'Groningen', categories: ['Wegevenement'], distances: [5, 10], priceMin: 7, priceMax: 9, lat: 53.16, lng: 6.86 },
]

export const SAMPLE_EVENTS: RunEvent[] = raw.map((e) => ({
  kids: false,
  relay: false,
  certified: false,
  free: false,
  featured: false,
  description:
    'Dit is een voorbeeldevenement. Zodra je Supabase koppelt, zie je hier de echte beschrijving van de organisatie.',
  ...e,
}))
