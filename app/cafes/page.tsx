'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import { useAppStore } from '@/lib/store'
import { mockCafes } from '@/lib/mockData'
import { fetchNearbyCafes, DUBLIN_CENTER } from '@/lib/places'
import { Cafe } from '@/lib/types'

// Dynamically import the map so it's never SSR'd and only bundled on demand
const CafeMapView = dynamic(() => import('@/components/cafes/CafeMapView'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-card bg-neutral-dark animate-pulse"
      style={{ height: 'calc(100dvh - 220px)', minHeight: '400px' }}
      aria-label="Loading map…"
    />
  ),
})

type SortOption = 'rating' | 'reviews' | 'name'

const HAS_MAP_KEY = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

export default function CafesPage() {
  const router = useRouter()
  const cafes = useAppStore((state) => state.cafes)
  const setCafes = useAppStore((state) => state.setCafes)
  const viewMode = useAppStore((state) => state.viewMode)
  const setViewMode = useAppStore((state) => state.setViewMode)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('rating')

  // Fetch real cafes from Places API, fall back to mock data
  useEffect(() => {
    fetchNearbyCafes(DUBLIN_CENTER.lat, DUBLIN_CENTER.lng).then((real) => {
      if (real.length > 0) {
        // Merge: real Places results + any mock cafes not already present by placeId
        const realIds = new Set(real.map((c) => c.placeId))
        const fallbacks = mockCafes.filter((m) => !realIds.has(m.placeId))
        setCafes([...real, ...fallbacks])
      }
      // If empty (no API key or error), keep the mock cafes that were seeded at init
    })
  }, [setCafes])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let list = q
      ? cafes.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.address.toLowerCase().includes(q)
        )
      : [...cafes]

    list.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'reviews') return b.reviewCount - a.reviewCount
      return a.name.localeCompare(b.name)
    })

    return list
  }, [cafes, search, sort])

  const handleCafeSelect = useCallback(
    (id: string) => router.push(`/cafe/${id}`),
    [router]
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral pb-28 md:pb-10">
        <div className="px-4 py-5 md:max-w-5xl md:mx-auto">

          {/* Desktop large title */}
          <div className="hidden md:flex items-end justify-between mb-5">
            <div>
              <h1 className="font-bold text-primary" style={{ fontSize: '34px' }}>Cafes</h1>
              <p className="text-primary-light text-[15px] mt-0.5">{cafes.length} cafes in Dublin</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <label htmlFor="cafe-search" className="sr-only">Search cafes</label>
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-light pointer-events-none" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              id="cafe-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cafes or areas…"
              className="w-full pl-9 pr-4 py-2.5 bg-surface rounded-xl text-primary text-[17px] placeholder:text-primary-light/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-shadow"
            />
          </div>

          {/* Controls row: sort pills + map/list toggle */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {(['rating', 'reviews', 'name'] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSort(opt)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    sort === opt
                      ? 'bg-accent text-white'
                      : 'bg-surface text-primary-light'
                  }`}
                >
                  {opt === 'rating' ? 'Top rated' : opt === 'reviews' ? 'Most reviewed' : 'A – Z'}
                </button>
              ))}
            </div>

            {/* Map / List segmented toggle */}
            {HAS_MAP_KEY && (
              <div
                className="flex shrink-0 bg-neutral-dark rounded-full p-0.5"
                role="group"
                aria-label="View mode"
              >
                {(['list', 'map'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent capitalize ${
                      viewMode === mode
                        ? 'bg-surface text-primary shadow-sm'
                        : 'text-primary-light'
                    }`}
                    aria-pressed={viewMode === mode}
                  >
                    {mode === 'list' ? (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        List
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                        </svg>
                        Map
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map view */}
          {viewMode === 'map' && HAS_MAP_KEY ? (
            <CafeMapView cafes={filtered} />
          ) : (
            /* List view */
            filtered.length === 0 ? (
              <div className="bg-surface rounded-card p-10 text-center">
                <p className="text-primary font-semibold mb-1">No cafes found</p>
                <p className="text-primary-light text-[15px]">Try a different search term.</p>
              </div>
            ) : (
              <>
                {/* Desktop grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((cafe) => (
                    <CafeCard key={cafe.id} cafe={cafe} onClick={() => handleCafeSelect(cafe.id)} />
                  ))}
                </div>

                {/* Mobile inset list */}
                <div className="md:hidden">
                  <p className="text-[13px] text-primary-light font-semibold uppercase tracking-wide mb-2 px-1">
                    {filtered.length} cafe{filtered.length !== 1 ? 's' : ''}
                  </p>
                  <div className="bg-surface rounded-card overflow-hidden">
                    {filtered.map((cafe, i) => (
                      <button
                        key={cafe.id}
                        type="button"
                        onClick={() => handleCafeSelect(cafe.id)}
                        className="w-full text-left flex items-center gap-3 px-4 py-3.5 active:bg-neutral transition-colors focus-visible:outline-none focus-visible:bg-neutral"
                        style={{ borderTop: i > 0 ? '0.5px solid rgba(0,0,0,0.10)' : undefined }}
                      >
                        <div className="w-11 h-11 rounded-[10px] bg-accent/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[15px] font-bold text-accent tabular-nums leading-none">{cafe.rating.toFixed(1)}</span>
                          <span className="text-[9px] text-accent leading-none">★</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[17px] font-medium text-primary truncate">{cafe.name}</p>
                          <p className="text-[13px] text-primary-light truncate">{cafe.address}</p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <span className="text-[12px] text-primary-light tabular-nums">{cafe.reviewCount} reviews</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-neutral-dark" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </main>
    </>
  )
}

function CafeCard({ cafe, onClick }: { cafe: Cafe; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-surface rounded-card p-4 hover:shadow-hover transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 w-full active:opacity-70"
    >
      {cafe.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cafe.photoUrl} alt={cafe.name} className="w-full h-28 object-cover rounded-lg mb-3" />
      ) : (
        <div className="w-full h-1.5 rounded-full bg-accent/20 mb-3" aria-hidden="true" />
      )}
      <h2 className="text-[17px] font-semibold text-primary mb-0.5 truncate">{cafe.name}</h2>
      <p className="text-[13px] text-primary-light mb-3 truncate">{cafe.address}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[20px] font-bold text-accent tabular-nums">{cafe.rating.toFixed(1)}</span>
          <span className="text-accent text-sm" aria-hidden="true">★</span>
        </div>
        <span className="text-[12px] text-primary-light">{cafe.reviewCount} reviews</span>
      </div>
    </button>
  )
}
