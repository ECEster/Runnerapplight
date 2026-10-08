/** Postcode → coördinaten via de gratis PDOK Locatieserver (Nederlandse overheid). */
const cacheMap = new Map<string, { lat: number; lng: number } | null>()

export async function geocodePostcode(postcode: string): Promise<{ lat: number; lng: number } | null> {
  const q = postcode.replace(/\s+/g, '').toUpperCase()
  if (!/^\d{4}([A-Z]{2})?$/.test(q)) return null
  if (cacheMap.has(q)) return cacheMap.get(q)!
  try {
    const type = q.length === 4 ? 'woonplaats OR postcode' : 'postcode'
    const res = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(q)}&fq=type:(${encodeURIComponent(type)})&rows=1&fl=centroide_ll`,
    )
    const json = await res.json()
    const point: string | undefined = json?.response?.docs?.[0]?.centroide_ll
    const m = point?.match(/POINT\(([-\d.]+) ([-\d.]+)\)/)
    const result = m ? { lng: Number(m[1]), lat: Number(m[2]) } : null
    cacheMap.set(q, result)
    return result
  } catch {
    return null
  }
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}
