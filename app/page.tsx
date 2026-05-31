'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Maximize2, X, MapPin, Star, MessageCircle, Flame, Map, LayoutList, Coffee, type LucideIcon } from 'lucide-react'
import Header from '@/components/Header'
import { useAppStore, useAuthStore } from '@/lib/store'
import { mockRatings, mockCafes } from '@/lib/mockData'
import { useGeolocation } from '@/lib/useGeolocation'
import { haversineKm, formatDistance } from '@/lib/distance'
import { DUBLIN_CENTER, fetchNearbyCafes } from '@/lib/places'
import { useTheme } from '@/components/ThemeProvider'
import { Cafe } from '@/lib/types'

const NearbyLeafletMap = dynamic(() => import('@/components/discover/NearbyLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-neutral-dark animate-pulse" aria-label="Loading map…" />
  ),
})

// ─── Sub-components ──────────────────────────────────────────────────────────

function CafeDistanceCard({ cafe, userLat, userLng, fullWidth }: {
  cafe: Cafe; userLat: number; userLng: number; fullWidth?: boolean
}) {
  const dist = haversineKm(userLat, userLng, cafe.latitude, cafe.longitude)
  return (
    <Link
      href={`/cafe/${cafe.id}`}
      className={`bg-surface rounded-card shadow-card p-4 flex flex-col active:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${fullWidth ? 'w-full' : 'shrink-0 w-44 h-[188px]'}`}
    >
      <div className="w-full h-20 rounded-xl bg-accent/10 flex items-center justify-center relative shrink-0">
        <span className="text-[32px] font-bold text-accent">{cafe.name[0]}</span>
      </div>
      <p className="text-[15px] font-semibold text-primary leading-tight line-clamp-2 mt-2">{cafe.name}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[13px] text-primary-light">{formatDistance(dist)}</span>
        <div className="flex items-center gap-0.5">
          <span className="text-[13px] font-bold text-accent tabular-nums">{cafe.rating.toFixed(1)}</span>
          <span className="text-accent text-[11px]" aria-hidden="true">★</span>
        </div>
      </div>
      {cafe.reviewCount > 0 && (
        <p className="text-[11px] text-primary-light/70">{cafe.reviewCount} reviews</p>
      )}
    </Link>
  )
}

function FilterChips({ filter, onChange }: {
  filter: 'near' | 'top' | 'reviewed'
  onChange: (f: 'near' | 'top' | 'reviewed') => void
}) {
  const chips: { id: 'near' | 'top' | 'reviewed'; label: string; Icon: LucideIcon }[] = [
    { id: 'near',     label: 'Near me',       Icon: MapPin        },
    { id: 'top',      label: 'Top rated',     Icon: Star          },
    { id: 'reviewed', label: 'Most reviewed', Icon: MessageCircle },
  ]
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
            filter === c.id
              ? 'bg-accent text-white'
              : 'bg-surface text-primary-light shadow-card'
          }`}
        >
          <c.Icon size={12} />
          {c.label}
        </button>
      ))}
    </div>
  )
}

function TrendingSection({ cafes }: { cafes: Cafe[] }) {
  const trending = cafes.slice().sort((a, b) => b.rating - a.rating).slice(0, 2)
  const badges = [
    { Icon: Flame, label: 'Trending'       },
    { Icon: Star,  label: 'Community fave' },
  ]
  return (
    <section aria-label="Trending cafes" className="mb-7">
      <h2 className="text-[18px] font-bold text-primary mb-3">Trending</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-none">
        {trending.map((cafe, i) => (
          <Link
            key={cafe.id}
            href={`/cafe/${cafe.id}`}
            className="shrink-0 w-60 rounded-card shadow-card overflow-hidden active:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div
              className="h-36 flex items-end p-4 relative"
              style={{ background: `linear-gradient(135deg, #D4A574 0%, #8B6F47 100%)` }}
            >
              <span className="absolute top-3 left-3 bg-white/90 text-[11px] font-bold text-accent px-2.5 py-1 rounded-full flex items-center gap-1">
                {(() => { const B = badges[i]; return <><B.Icon size={10} />{B.label}</> })()}
              </span>
              <span className="text-white/20 font-bold absolute right-4 top-2 text-[64px] leading-none select-none">
                {cafe.name[0]}
              </span>
              <div className="relative">
                <p className="text-white font-bold text-[16px] leading-tight line-clamp-2">{cafe.name}</p>
                <p className="text-white/70 text-[12px] mt-0.5">{cafe.address.split(',')[1]?.trim() ?? cafe.address}</p>
              </div>
            </div>
            <div className="bg-surface px-4 py-2.5 flex items-center justify-between">
              <span className="text-[13px] text-primary-light">{cafe.reviewCount} reviews</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[15px] font-bold text-accent tabular-nums">{cafe.rating.toFixed(1)}</span>
                <span className="text-accent text-[12px]">★</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function TopRatedList({ topRatings }: { topRatings: typeof mockRatings }) {
  return (
    <section aria-label="Top rated items">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-bold text-primary">Top rated</h2>
        <Link href="/leaderboards" className="text-[15px] text-accent font-medium focus-visible:outline-none">
          Leaderboard
        </Link>
      </div>
      <div className="bg-surface rounded-card shadow-card overflow-hidden">
        {topRatings.map((rating, i) => {
          const cafe = mockCafes.find((c) => c.id === rating.cafeId)
          return (
            <Link
              key={rating.id}
              href={`/cafe/${rating.cafeId}`}
              className="flex items-center gap-3 px-4 py-3.5 active:bg-neutral transition-colors focus-visible:outline-none focus-visible:bg-neutral"
              style={{ borderTop: i > 0 ? '0.5px solid rgba(0,0,0,0.10)' : undefined }}
            >
              <span className="text-[14px] font-bold tabular-nums text-primary-light w-5 text-right shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold text-primary truncate">{rating.itemName}</p>
                {cafe && <p className="text-[13px] text-accent truncate">{cafe.name}</p>}
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <span className="text-[17px] font-bold text-accent tabular-nums">{rating.score}</span>
                <span className="text-accent text-[12px]" aria-hidden="true">★</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function RecentReviews({ recentRatings }: { recentRatings: typeof mockRatings }) {
  return (
    <section aria-label="Recent reviews">
      <h2 className="text-[18px] font-bold text-primary mb-3">Recent reviews</h2>
      <div className="flex flex-col gap-3">
        {recentRatings.map((rating) => {
          const cafe = mockCafes.find((c) => c.id === rating.cafeId)
          const formattedDate = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'short' }).format(new Date(rating.createdAt))
          return (
            <Link
              key={rating.id}
              href={`/cafe/${rating.cafeId}`}
              className="bg-surface rounded-card shadow-card p-4 flex gap-3 active:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {(rating.user as { avatar?: string }).avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={(rating.user as { avatar?: string }).avatar}
                  alt={rating.user.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-[16px] shrink-0">
                  {rating.user.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[15px] font-semibold text-primary">{rating.user.name}</span>
                  <span className="text-primary-light/50 text-[12px]">·</span>
                  <span className="text-[13px] text-primary-light">{formattedDate}</span>
                </div>
                <p className="text-[15px] text-accent font-medium truncate">{rating.itemName}</p>
                {cafe && <p className="text-[13px] text-primary-light truncate">{cafe.name}</p>}
                {rating.notes && <p className="text-[14px] text-primary-light mt-1 line-clamp-2 leading-snug">{rating.notes}</p>}
              </div>
              <div className="flex items-center gap-0.5 shrink-0 self-start pt-0.5">
                <span className="text-[18px] font-bold text-accent tabular-nums">{rating.score}</span>
                <span className="text-accent text-[12px]" aria-hidden="true">★</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// Preview sheet shown when a map pin is tapped
function CafePreviewSheet({ cafe, userLat, userLng, onClose, onNavigate }: {
  cafe: Cafe; userLat: number; userLng: number
  onClose: () => void; onNavigate: (id: string) => void
}) {
  const dist = haversineKm(userLat, userLng, cafe.latitude, cafe.longitude)
  const topItem = mockRatings.filter(r => r.cafeId === cafe.id).sort((a, b) => b.score - a.score)[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-surface w-full max-w-sm rounded-t-3xl sm:rounded-card p-5 pb-safe shadow-modal">
        <div className="w-8 h-1 bg-neutral-dark rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-[20px] font-bold text-primary leading-tight">{cafe.name}</h2>
            <p className="text-[13px] text-primary-light mt-0.5 truncate">{cafe.address}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral flex items-center justify-center text-primary-light shrink-0 active:opacity-60"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full">
            <span className="text-[15px] font-bold text-accent tabular-nums">{cafe.rating.toFixed(1)}</span>
            <span className="text-accent text-[12px]">★</span>
          </div>
          <div className="text-[13px] text-primary-light">
            <span className="font-medium text-primary">{formatDistance(dist)}</span> away
          </div>
          <div className="text-[13px] text-primary-light">{cafe.reviewCount} reviews</div>
        </div>

        {topItem && (
          <div className="bg-neutral rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] text-primary-light uppercase tracking-wide font-semibold mb-0.5">Top item</p>
              <p className="text-[15px] font-semibold text-primary truncate">{topItem.itemName}</p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="text-[18px] font-bold text-accent tabular-nums">{topItem.score}</span>
              <span className="text-accent text-[13px]">★</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onNavigate(cafe.id)}
          className="w-full py-3.5 rounded-full bg-accent text-white font-semibold text-[17px] active:opacity-80 transition-opacity"
        >
          View cafe →
        </button>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const cafes = useAppStore((s) => s.cafes)
  const setCafes = useAppStore((s) => s.setCafes)
  const user = useAuthStore((s) => s.user)
  const geo = useGeolocation()
  const router = useRouter()
  const { dark } = useTheme()

  const [greeting, setGreeting] = useState('Good morning')
  const [filter, setFilter] = useState<'near' | 'top' | 'reviewed'>('near')
  const [mapView, setMapView] = useState<'map' | 'list'>('map')
  const [previewCafe, setPreviewCafe] = useState<Cafe | null>(null)
  const [mapFullscreen, setMapFullscreen] = useState(false)
  // True once real cafe data has loaded — prevents Dublin mock cafes showing
  const [cafesReady, setCafesReady] = useState(false)

  // Persist map/list toggle preference
  useEffect(() => {
    const saved = localStorage.getItem('cups-map-view')
    if (saved === 'list' || saved === 'map') setMapView(saved)
  }, [])
  useEffect(() => {
    localStorage.setItem('cups-map-view', mapView)
  }, [mapView])

  // Fetch real nearby cafes when location is available.
  // cafesReady stays false until the fetch resolves so the UI shows skeletons
  // instead of Dublin mock cafes during the GPS + API loading window.
  useEffect(() => {
    if (!geo.lat || !geo.lng) return
    const userLat = geo.lat
    const userLng = geo.lng
    fetchNearbyCafes(userLat, userLng).then((fetched) => {
      if (fetched.length > 0) {
        setCafes(fetched)
      } else {
        // Fallback: offset mock cafes around real GPS position
        const offsetCafes = mockCafes.map((cafe) => ({
          ...cafe,
          latitude:  userLat + (cafe.latitude  - DUBLIN_CENTER.lat),
          longitude: userLng + (cafe.longitude - DUBLIN_CENTER.lng),
        }))
        setCafes(offsetCafes)
      }
      setCafesReady(true)
    })
  }, [geo.lat, geo.lng, setCafes])

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) setGreeting('Good morning')
    else if (h >= 12 && h < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const mapLat = geo.lat ?? DUBLIN_CENTER.lat
  const mapLng = geo.lng ?? DUBLIN_CENTER.lng

  const nearbyCafes = useMemo(() => {
    const withDist = cafes.map((c) => ({ ...c, dist: haversineKm(mapLat, mapLng, c.latitude, c.longitude) }))
    if (filter === 'near') return withDist.sort((a, b) => a.dist - b.dist)
    if (filter === 'top') return withDist.sort((a, b) => b.rating - a.rating)
    return withDist.sort((a, b) => b.reviewCount - a.reviewCount)
  }, [cafes, mapLat, mapLng, filter])

  const topRatings = useMemo(
    () => [...mockRatings].sort((a, b) => b.score - a.score).slice(0, 6),
    []
  )

  const recentRatings = useMemo(
    () => [...mockRatings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    []
  )

  // Wire map pin → preview sheet
  const handleCafeSelect = useCallback((id: string) => {
    const cafe = nearbyCafes.find(c => c.id === id)
    if (cafe) setPreviewCafe(cafe)
  }, [nearbyCafes])

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>
    w.__cupsSelectCafe = handleCafeSelect
    w.__cupsNavigate = (id: string) => router.push(`/cafe/${id}`)
    return () => {
      delete w.__cupsSelectCafe
      delete w.__cupsNavigate
    }
  }, [handleCafeSelect, router])

  const mapTheme = dark ? 'dark' : 'light'
  const theMap = !geo.loading
    ? <NearbyLeafletMap cafes={nearbyCafes} userLat={mapLat} userLng={mapLng} theme={mapTheme} />
    : <div className="w-full h-full bg-neutral-dark animate-pulse" aria-label="Loading map…" />

  return (
    <>
      <Header />

      {/* ── MOBILE layout ─────────────────────────────── */}
      <main className="md:hidden bg-neutral min-h-screen pb-28">

        {/* Greeting */}
        <div className="px-5 pt-5 pb-3">
          <h1 className="text-[30px] font-bold text-primary leading-tight">
            {greeting}{user ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <div className="mt-1">
            {geo.error ? (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center gap-1 text-[14px] text-accent underline underline-offset-2"
              >
                <MapPin size={13} className="shrink-0" />
                Enable location for better results
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <MapPin size={13} className="text-primary-light shrink-0" />
                <p className="text-[14px] text-primary-light">
                  {geo.loading ? 'Finding your location…' : 'Near you'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filter chips + map/list toggle */}
        <div className="px-5 mb-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <FilterChips filter={filter} onChange={setFilter} />
          </div>
          <div className="flex bg-surface rounded-full shadow-card p-0.5 shrink-0">
            {(['map', 'list'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setMapView(v)}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                  mapView === v ? 'bg-accent text-white' : 'text-primary-light'
                }`}
              >
                <span className="flex items-center gap-1">
                  {v === 'map' ? <Map size={13} /> : <LayoutList size={13} />}
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Map (hidden in list mode) */}
        {mapView === 'map' && (
          <div className="px-5 mb-5">
            <div className="relative w-full rounded-card overflow-hidden shadow-card" style={{ height: 220 }}>
              {theMap}
              <button
                type="button"
                onClick={() => setMapFullscreen(true)}
                aria-label="Expand map"
                className="absolute top-2.5 right-2.5 z-10 bg-white/85 backdrop-blur-sm rounded-full p-2 shadow-card active:opacity-70 transition-opacity"
              >
                <Maximize2 size={15} className="text-primary" />
              </button>
            </div>
          </div>
        )}

        {/* Nearby */}
        <section className="mb-7" aria-label="Nearby cafes">
          <div className="px-5 flex items-center justify-between mb-3">
            <h2 className="text-[18px] font-bold text-primary">Nearby</h2>
            {cafesReady && <Link href="/cafes" className="text-[15px] text-accent font-medium">See all</Link>}
          </div>
          {!cafesReady ? (
            /* Skeleton cards while GPS + Foursquare load */
            <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shrink-0 w-44 h-[188px] bg-surface rounded-card shadow-card animate-pulse" />
              ))}
            </div>
          ) : mapView === 'list' ? (
            <div className="px-5 flex flex-col gap-3">
              {nearbyCafes.map((cafe) => (
                <CafeDistanceCard key={cafe.id} cafe={cafe} userLat={mapLat} userLng={mapLng} fullWidth />
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none" style={{ scrollSnapType: 'x mandatory' }}>
              {nearbyCafes.map((cafe) => (
                <div key={cafe.id} style={{ scrollSnapAlign: 'start' }}>
                  <CafeDistanceCard cafe={cafe} userLat={mapLat} userLng={mapLng} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trending */}
        <div className="px-5 mb-2">
          <TrendingSection cafes={cafes} />
        </div>

        <div className="px-5 mb-7"><TopRatedList topRatings={topRatings} /></div>
        <div className="px-5"><RecentReviews recentRatings={recentRatings} /></div>
      </main>

      {/* ── DESKTOP layout: split panel ───────────────── */}
      <div
        className="hidden md:flex bg-neutral overflow-hidden"
        style={{ height: 'calc(100vh - 60px)' }}
      >
        {/* LEFT — full-height sticky map */}
        <div className="relative shrink-0" style={{ width: '58%', height: '100%' }}>
          {theMap}
          {/* Filter chips overlay on map */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
            <FilterChips filter={filter} onChange={setFilter} />
          </div>
        </div>

        {/* RIGHT — scrollable feed */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ borderLeft: '0.5px solid rgba(0,0,0,0.08)' }}
        >
          <div className="px-7 pt-8 pb-4">
            <h1 className="text-[32px] font-bold text-primary leading-tight">
              {greeting}{user ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <div className="mt-1">
              {geo.error ? (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-1 text-[15px] text-accent underline underline-offset-2"
                >
                  <MapPin size={14} className="shrink-0" />
                  Enable location for better results
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-primary-light shrink-0" />
                  <p className="text-[15px] text-primary-light">
                    {geo.loading ? 'Finding your location…' : 'Near you'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Nearby 2-col grid */}
          <section className="px-7 mb-7" aria-label="Nearby cafes">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[18px] font-bold text-primary">Nearby</h2>
              {cafesReady && <Link href="/cafes" className="text-[15px] text-accent font-medium">See all</Link>}
            </div>
            {!cafesReady ? (
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[188px] bg-surface rounded-card shadow-card animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {nearbyCafes.map((cafe) => (
                  <CafeDistanceCard key={cafe.id} cafe={cafe} userLat={mapLat} userLng={mapLng} fullWidth />
                ))}
              </div>
            )}
          </section>

          <div className="px-7 mb-7"><TrendingSection cafes={cafes} /></div>
          <div className="px-7 mb-7"><TopRatedList topRatings={topRatings} /></div>
          <div className="px-7 pb-10"><RecentReviews recentRatings={recentRatings} /></div>
        </div>
      </div>

      {/* Cafe preview sheet (both layouts) */}
      {previewCafe && (
        <CafePreviewSheet
          cafe={previewCafe}
          userLat={mapLat}
          userLng={mapLng}
          onClose={() => setPreviewCafe(null)}
          onNavigate={(id) => { setPreviewCafe(null); router.push(`/cafe/${id}`) }}
        />
      )}

      {/* Full-screen map modal */}
      {mapFullscreen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-neutral">
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 h-[52px] shrink-0"
            style={{
              background: 'var(--header-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '0.5px solid var(--border-color)',
            }}
          >
            <span className="text-[17px] font-semibold text-primary">Nearby Cafes</span>
            <button
              type="button"
              onClick={() => setMapFullscreen(false)}
              aria-label="Close map"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral text-primary-light active:opacity-60 transition-opacity"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
          {/* Full-height map */}
          <div className="flex-1 relative">
            <NearbyLeafletMap cafes={nearbyCafes} userLat={mapLat} userLng={mapLng} theme={mapTheme} />
          </div>
        </div>
      )}
    </>
  )
}
