'use client'

import { useState, useCallback } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'
import CafeMarker from './CafeMarker'
import { Cafe } from '@/lib/types'
import { DUBLIN_CENTER } from '@/lib/places'

const LIBRARIES: ('places')[] = ['places']

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  zoomControlOptions: {
    position: 9, // RIGHT_BOTTOM
  },
  gestureHandling: 'greedy',
  clickableIcons: false,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4e6f1' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#1C1C1E' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8E8E93' }] },
  ],
}

interface CafeMapViewProps {
  cafes: Cafe[]
}

export default function CafeMapView({ cafes }: CafeMapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: LIBRARIES,
  })

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id)
  }, [])

  if (loadError) {
    return (
      <div className="bg-surface rounded-card p-10 text-center">
        <p className="text-primary font-semibold mb-1">Map unavailable</p>
        <p className="text-primary-light text-[15px]">Check your Google Maps API key.</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        className="w-full rounded-card bg-neutral-dark animate-pulse"
        style={{ height: 'calc(100dvh - 220px)', minHeight: '400px' }}
        aria-label="Loading map…"
      />
    )
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full rounded-card overflow-hidden"
      mapContainerStyle={{ height: 'calc(100dvh - 220px)', minHeight: '400px' }}
      center={DUBLIN_CENTER}
      zoom={14}
      options={MAP_OPTIONS}
      onClick={() => setSelectedId(null)}
    >
      {cafes.map((cafe) => (
        <CafeMarker
          key={cafe.id}
          cafe={cafe}
          isSelected={selectedId === cafe.id}
          onSelect={handleSelect}
        />
      ))}
    </GoogleMap>
  )
}
