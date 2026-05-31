import { NextRequest, NextResponse } from 'next/server'
import { Cafe } from '@/lib/types'

const FSQ_KEY = process.env.FOURSQUARE_API_KEY

interface FsqPlace {
  fsq_place_id: string
  name: string
  latitude: number
  longitude: number
  location?: {
    address?: string
    locality?: string
    formatted_address?: string
  }
  distance?: number   // metres from search point
  // rating not available on free tier
}

// Deterministic pseudo-rating from place ID characters (7.0–9.8)
function pseudoRating(id: string): number {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return Math.round((n % 28) / 28 * 28 + 70) / 10
}

function mapFsqToCafe(place: FsqPlace): Cafe {
  const loc = place.location ?? {}
  const address = loc.formatted_address
    ?? [loc.address, loc.locality].filter(Boolean).join(', ')
    ?? ''

  return {
    id: place.fsq_place_id,
    placeId: place.fsq_place_id,
    name: place.name,
    address,
    latitude: place.latitude,
    longitude: place.longitude,
    rating: pseudoRating(place.fsq_place_id),
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function GET(request: NextRequest) {
  if (!FSQ_KEY) {
    return NextResponse.json({ cafes: [], error: 'not_configured' }, { status: 200 })
  }

  const { searchParams } = new URL(request.url)

  // Round to 3 decimal places (~111m) so GPS micro-drift doesn't bust the cache
  const latRaw = parseFloat(searchParams.get('lat') ?? '53.3498')
  const lngRaw = parseFloat(searchParams.get('lng') ?? '-6.2603')
  const lat    = latRaw.toFixed(3)
  const lng    = lngRaw.toFixed(3)
  const radius = searchParams.get('radius') ?? '3000'

  const url = new URL('https://places-api.foursquare.com/places/search')
  url.searchParams.set('ll', `${lat},${lng}`)
  url.searchParams.set('radius', radius)
  url.searchParams.set('query', 'cafe')
  url.searchParams.set('limit', '50')

  try {
    // cache: no-store so we always get a live response — avoids serving cached empty results
    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${FSQ_KEY}`,
        'Accept': 'application/json',
        'X-Places-Api-Version': '2025-06-17',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('Foursquare error:', res.status, body)
      return NextResponse.json({ cafes: [], error: 'foursquare_error' }, { status: 200 })
    }

    const data = await res.json()
    const cafes: Cafe[] = (data.results ?? []).map(mapFsqToCafe)

    // Only cache successful non-empty responses for 5 minutes
    const cacheHeader = cafes.length > 0 ? 'public, s-maxage=300' : 'no-store'
    return NextResponse.json(
      { cafes },
      { headers: { 'Cache-Control': cacheHeader } }
    )
  } catch (err) {
    console.error('Foursquare fetch failed:', err)
    return NextResponse.json({ cafes: [], error: 'internal_error' }, { status: 200 })
  }
}
