import { NextRequest, NextResponse } from 'next/server'
import { Cafe } from '@/lib/types'

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

interface PlacesResult {
  place_id: string
  name: string
  vicinity: string
  geometry: { location: { lat: number; lng: number } }
  rating?: number
  user_ratings_total?: number
  photos?: { photo_reference: string }[]
}

function mapPlacesToCafe(place: PlacesResult): Cafe {
  const photoRef = place.photos?.[0]?.photo_reference
  const photoUrl = photoRef && PLACES_API_KEY
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${PLACES_API_KEY}`
    : undefined

  return {
    id: place.place_id,
    placeId: place.place_id,
    name: place.name,
    address: place.vicinity,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    // Google rates 0–5; scale to 0–10
    rating: place.rating ? Math.round(place.rating * 2 * 10) / 10 : 0,
    reviewCount: place.user_ratings_total ?? 0,
    photoUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat') ?? '53.3498'
  const lng = searchParams.get('lng') ?? '-6.2603'
  const radius = searchParams.get('radius') ?? '2000'

  if (!PLACES_API_KEY) {
    return NextResponse.json(
      { cafes: [], error: 'not_configured' },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
    url.searchParams.set('location', `${lat},${lng}`)
    url.searchParams.set('radius', radius)
    url.searchParams.set('type', 'cafe')
    url.searchParams.set('keyword', 'cafe coffee')
    url.searchParams.set('key', PLACES_API_KEY)

    const res = await fetch(url.toString(), { next: { revalidate: 300 } })

    if (!res.ok) {
      return NextResponse.json({ cafes: [], error: 'fetch_failed' }, { status: 200 })
    }

    const data = await res.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json({ cafes: [], error: data.status }, { status: 200 })
    }

    const cafes: Cafe[] = (data.results ?? []).slice(0, 30).map(mapPlacesToCafe)

    return NextResponse.json(
      { cafes },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    )
  } catch {
    return NextResponse.json({ cafes: [], error: 'internal_error' }, { status: 200 })
  }
}
