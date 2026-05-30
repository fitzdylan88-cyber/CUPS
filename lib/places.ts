import { Cafe } from './types'

export const DUBLIN_CENTER = { lat: 53.3498, lng: -6.2603 }

export async function fetchNearbyCafes(
  lat: number,
  lng: number,
  radius = 2000
): Promise<Cafe[]> {
  try {
    const res = await fetch(
      `/api/places/search?lat=${lat}&lng=${lng}&radius=${radius}`
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.cafes ?? []
  } catch {
    return []
  }
}
