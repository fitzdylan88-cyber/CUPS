'use client'

import { useEffect, useRef } from 'react'
import { Cafe } from '@/lib/types'

interface Props {
  cafes: Cafe[]
  userLat: number
  userLng: number
  theme?: 'light' | 'dark'
}

const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

export default function NearbyLeafletMap({ cafes, userLat, userLng, theme = 'light' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<import('leaflet').Map | null>(null)
  const userMarkerRef = useRef<import('leaflet').Marker | null>(null)
  const cafeLayerRef  = useRef<import('leaflet').LayerGroup | null>(null)
  const tileLayerRef  = useRef<import('leaflet').TileLayer | null>(null)
  const LRef          = useRef<typeof import('leaflet') | null>(null)

  // ── One-time map initialisation ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return
    if ((containerRef.current as unknown as Record<string, unknown>)._leaflet_id) return

    let ro: ResizeObserver

    import('leaflet').then((mod) => {
      const L = mod.default ?? mod
      LRef.current = L

      if (!containerRef.current || mapRef.current) return

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([userLat, userLng], 15)

      mapRef.current = map

      // Tile layer (respects initial theme)
      tileLayerRef.current = L.tileLayer(theme === 'dark' ? TILE_DARK : TILE_LIGHT, {
        maxZoom: 19,
      }).addTo(map)

      // User location pulse dot
      const userIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#007AFF;border:2.5px solid white;box-shadow:0 0 0 5px rgba(0,122,255,0.18)"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map)

      // Cafe markers layer group
      cafeLayerRef.current = L.layerGroup().addTo(map)

      requestAnimationFrame(() => map.invalidateSize())
      setTimeout(() => map.invalidateSize(), 100)

      ro = new ResizeObserver(() => map.invalidateSize())
      if (containerRef.current) ro.observe(containerRef.current)
    })

    return () => {
      ro?.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
      userMarkerRef.current = null
      cafeLayerRef.current = null
      tileLayerRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Re-centre + move user dot when location changes ─────────────────────────
  useEffect(() => {
    if (!mapRef.current || !userMarkerRef.current) return
    mapRef.current.setView([userLat, userLng], mapRef.current.getZoom(), { animate: true })
    userMarkerRef.current.setLatLng([userLat, userLng])
  }, [userLat, userLng])

  // ── Re-draw cafe markers when cafes list changes ─────────────────────────────
  useEffect(() => {
    if (!cafeLayerRef.current || !LRef.current) return
    const L = LRef.current
    cafeLayerRef.current.clearLayers()
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
      L.marker([cafe.latitude, cafe.longitude], { icon: pill }).addTo(cafeLayerRef.current!)
    })
  }, [cafes])

  // ── Swap tile layer when theme changes ───────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !LRef.current || !tileLayerRef.current) return
    const L = LRef.current
    tileLayerRef.current.remove()
    tileLayerRef.current = L.tileLayer(theme === 'dark' ? TILE_DARK : TILE_LIGHT, {
      maxZoom: 19,
    }).addTo(mapRef.current)
  }, [theme])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      {/* isolation:isolate keeps Leaflet z-indices below modals */}
      <div style={{ width: '100%', height: '100%', isolation: 'isolate', borderRadius: 'inherit' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  )
}
