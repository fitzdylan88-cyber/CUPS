'use client'

import { useState, useEffect } from 'react'

interface GeoState {
  lat: number | null
  lng: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ lat: null, lng: null, error: null, loading: true })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ lat: null, lng: null, error: 'Geolocation not supported', loading: false })
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, error: null, loading: false }),
      () => setState({ lat: null, lng: null, error: 'Location access denied', loading: false }),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return state
}
