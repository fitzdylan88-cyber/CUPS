import { Cafe } from './types'

export const DUBLIN_CENTER = { lat: 53.3498, lng: -6.2603 }

export async function fetchNearbyCafes(
  lat: number,
  lng: number,
  radius = 3000
): Promise<Cafe[]> {
  try {
    // cache: 'no-store' bypasses the service worker's 24-hour API cache
    // so GPS updates always get a fresh response
    const res = await fetch(
      `/api/places/search?lat=${lat}&lng=${lng}&radius=${radius}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.cafes ?? []
  } catch {
    return []
  }
}
