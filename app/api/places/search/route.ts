import { NextRequest, NextResponse } from 'next/server'
import { Cafe } from '@/lib/types'

interface OverpassElement {
  type: string
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string | undefined>
}

function buildAddress(tags: Record<string, string | undefined> = {}): string {
  const parts: string[] = []
  const num    = tags['addr:housenumber']
  const street = tags['addr:street']
  const city   = tags['addr:city']
  if (num && street) parts.push(`${num} ${street}`)
  else if (street)   parts.push(street)
  if (city)          parts.push(city)
  return parts.join(', ') || ''
}

// Deterministic pseudo-rating from OSM node ID so it looks consistent (7.0–9.8)
function pseudoRating(id: number): number {
  return Math.round(((id % 28) / 28 * 28 + 70)) / 10
}

function mapElementToCafe(el: OverpassElement): Cafe | null {
  const lat = el.lat ?? el.center?.lat
  const lon = el.lon ?? el.center?.lon
  if (!lat || !lon) return null

  const tags = el.tags ?? {}
  const name = tags.name
  if (!name) return null   // skip unnamed nodes

  return {
    id: `osm-${el.id}`,
    placeId: `osm-${el.id}`,
    name,
    address: buildAddress(tags),
    latitude: lat,
    longitude: lon,
    rating: pseudoRating(el.id),
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat    = parseFloat(searchParams.get('lat')    ?? '53.3498')
  const lng    = parseFloat(searchParams.get('lng')    ?? '-6.2603')
  const radius = parseInt(  searchParams.get('radius') ?? '2000', 10)

  // Overpass QL — fetch cafe nodes AND ways within radius
  const query = `
[out:json][timeout:15];
(
  node["amenity"="cafe"](around:${radius},${lat},${lng});
  way["amenity"="cafe"](around:${radius},${lat},${lng});
);
out center body;
`.trim()

  try {
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    const res = await fetch(overpassUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CUPS-App/1.0 (cafe-rating-pwa; contact=fitzdylan88@gmail.com)',
      },
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      return NextResponse.json({ cafes: [], error: 'overpass_error' }, { status: 200 })
    }

    const data = await res.json()
    const cafes: Cafe[] = (data.elements ?? [])
      .map(mapElementToCafe)
      .filter((c: Cafe | null): c is Cafe => c !== null)
      .slice(0, 40)

    return NextResponse.json(
      { cafes },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    )
  } catch {
    return NextResponse.json({ cafes: [], error: 'internal_error' }, { status: 200 })
  }
}
