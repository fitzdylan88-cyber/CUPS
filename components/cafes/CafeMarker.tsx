'use client'

import { useRouter } from 'next/navigation'
import { Marker, InfoWindow } from '@react-google-maps/api'
import { Cafe } from '@/lib/types'

// Branded SVG pin in the app's warm brown (#8B6F47)
const MARKER_ICON_DEFAULT = {
  url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.163 0 0 7.163 0 16c0 10.627 14.234 22.965 15.346 23.912a1 1 0 0 0 1.308 0C17.766 38.965 32 26.627 32 16 32 7.163 24.837 0 16 0Z" fill="%238B6F47"/><circle cx="16" cy="16" r="6" fill="white"/></svg>`,
  scaledSize: { width: 32, height: 40 } as google.maps.Size,
  anchor: { x: 16, y: 40 } as google.maps.Point,
}

const MARKER_ICON_ACTIVE = {
  url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48"><path d="M19 0C8.507 0 0 8.507 0 19c0 12.627 17.028 27.617 18.228 28.621a1.2 1.2 0 0 0 1.544 0C21.028 46.617 38 31.627 38 19 38 8.507 29.493 0 19 0Z" fill="%238B6F47"/><circle cx="19" cy="19" r="7" fill="white"/></svg>`,
  scaledSize: { width: 38, height: 48 } as google.maps.Size,
  anchor: { x: 19, y: 48 } as google.maps.Point,
}

interface CafeMarkerProps {
  cafe: Cafe
  isSelected: boolean
  onSelect: (id: string | null) => void
}

export default function CafeMarker({ cafe, isSelected, onSelect }: CafeMarkerProps) {
  const router = useRouter()

  return (
    <Marker
      position={{ lat: cafe.latitude, lng: cafe.longitude }}
      icon={isSelected ? MARKER_ICON_ACTIVE : MARKER_ICON_DEFAULT}
      onClick={() => onSelect(isSelected ? null : cafe.id)}
      title={cafe.name}
    >
      {isSelected && (
        <InfoWindow
          position={{ lat: cafe.latitude, lng: cafe.longitude }}
          onCloseClick={() => onSelect(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -48) }}
        >
          <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: '4px 2px', maxWidth: '240px' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#1C1C1E', marginBottom: '2px' }}>
              {cafe.name}
            </p>
            <p style={{ fontSize: '13px', color: '#8E8E93', marginBottom: '8px', lineHeight: '1.3' }}>
              {cafe.address}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#8B6F47' }}>
                {cafe.rating.toFixed(1)} ★
              </span>
              <button
                onClick={() => router.push(`/cafe/${cafe.id}`)}
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'white',
                  background: '#8B6F47',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  cursor: 'pointer',
                }}
              >
                View cafe
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  )
}
