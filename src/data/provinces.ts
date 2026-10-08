export type Region = 'noord' | 'oost' | 'zuid' | 'west'

export const PROVINCES = [
  'Drenthe',
  'Flevoland',
  'Friesland',
  'Gelderland',
  'Groningen',
  'Limburg',
  'Noord-Brabant',
  'Noord-Holland',
  'Overijssel',
  'Utrecht',
  'Zeeland',
  'Zuid-Holland',
] as const

export const REGIONS: { id: Region; label: string; provinces: string[] }[] = [
  { id: 'noord', label: 'Noord', provinces: ['Groningen', 'Friesland', 'Drenthe'] },
  { id: 'oost', label: 'Oost', provinces: ['Overijssel', 'Gelderland', 'Flevoland'] },
  { id: 'zuid', label: 'Zuid', provinces: ['Noord-Brabant', 'Limburg', 'Zeeland'] },
  { id: 'west', label: 'West', provinces: ['Noord-Holland', 'Zuid-Holland', 'Utrecht'] },
]

export function regionOf(province: string): Region | undefined {
  return REGIONS.find((r) => r.provinces.includes(province))?.id
}
