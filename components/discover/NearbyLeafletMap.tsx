'use client'

import { useEffect, useRef } from 'react'
import { Cafe } from '@/lib/types'

interface Props {
  cafes: Cafe[]
  userLat: number
  userLng: number
}

export default function NearbyLeafletMap({ cafes, userLat, userLng }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if ((containerRef.current as unknown as Record<string, unknown>)._leaflet_id) return

    let L: typeof import('leaflet')
    let map: import('leaflet').Map

    import('leaflet').then((mod) => {
      L = mod.default ?? mod
      if (!containerRef.current || (containerRef.current as unknown as Record<string, unknown>)._leaflet_id) return

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

      map = L.map(containerRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).setView([userLat, userLng], 15)

      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map)

      // User location pulse dot
      const userIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#007AFF;border:2.5px solid white;box-shadow:0 0 0 5px rgba(0,122,255,0.18)"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map)

      // Score pill markers — clicking calls window.__cupsSelectCafe for preview sheet
      cafes.forEach((cafe) => {
        const pill = L.divIcon({
          html: `<div
            onclick="window.__cupsSelectCafe&&window.__cupsSelectCafe('${cafe.id}')"
            style="background:#8B6F47;color:white;padding:5px 10px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 10px rgba(0,0,0,0.28);cursor:pointer;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,sans-serif;user-select:none"
          >☕ ${cafe.rating.toFixed(1)}</div>`,
          className: '',
          iconSize: [64, 30],
          iconAnchor: [32, 15],
        })
        L.marker([cafe.latitude, cafe.longitude], { icon: pill }).addTo(map)
      })

      requestAnimationFrame(() => map?.invalidateSize())
      setTimeout(() => map?.invalidateSize(), 100)

      const ro = new ResizeObserver(() => map?.invalidateSize())
      if (containerRef.current) ro.observe(containerRef.current)

      return () => ro.disconnect()
    })

    return () => {
      if (mapRef.current) {
        (mapRef.current as import('leaflet').Map).remove()
        mapRef.current = null
      }
    }
  }, [cafes, userLat, userLng])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      {/* isolation:isolate contains Leaflet's z-indices so modals render above the map */}
      <div style={{ width: '100%', height: '100%', isolation: 'isolate', borderRadius: 'inherit' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  )
}
