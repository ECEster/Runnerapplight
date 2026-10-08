// Soorten evenementen (zelfde lijst als op de huidige site) en de foto per soort.
// Wil je een andere foto voor een soort? Zet de afbeelding in public/images/categories/
// en pas hieronder het pad aan. Meerdere foto's per soort mag: er wordt dan afgewisseld.

export const EVENT_TYPES = [
  'Marathon',
  'Trail',
  'Crossloop',
  'Gemengd parcours',
  'Wegevenement',
  'Parkloop',
  'Fun Run',
  'SwimRun',
  'Urban Run',
  'Survival Run',
  'Ultrarun',
  'Virtuele Run',
  'Estafette',
  'Coopertest',
  'Baanevenement',
  'Studentenevenement',
  'Sportief Wandelen',
  'Inclusieve Run',
  'Gecertificeerd Parcours',
  'Bike Run',
] as const

const CROSS = ['/images/categories/cross.webp']
const ROAD = ['/images/categories/weg.webp']
const KIDS = ['/images/categories/kids.webp']

export const CATEGORY_PHOTOS: Record<string, string[]> = {
  Trail: CROSS,
  Crossloop: CROSS,
  'Gemengd parcours': CROSS,
  'Survival Run': CROSS,
  Ultrarun: CROSS,
  'Sportief Wandelen': CROSS,
  Wegevenement: ROAD,
  Marathon: ROAD,
  Parkloop: ROAD,
  'Urban Run': ROAD,
  'Fun Run': ROAD,
  Estafette: ROAD,
  'Kids Runs': KIDS,
}

export const DEFAULT_PHOTOS = ROAD

/** Kies een foto voor een evenement: eigen foto > kids > eerste categorie > standaard. */
export function photoFor(e: { id: string; image?: string | null; kids?: boolean; categories: string[] }): string {
  if (e.image) return e.image
  const list = (e.kids && CATEGORY_PHOTOS['Kids Runs']) || CATEGORY_PHOTOS[e.categories[0] ?? ''] || DEFAULT_PHOTOS
  // wissel af op basis van het id, zodat dezelfde foto niet steeds naast elkaar staat
  let hash = 0
  for (const ch of e.id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return list[hash % list.length]
}
