import Link from 'next/link'
import Header from '@/components/Header'
import { mockCafes, mockRatings } from '@/lib/mockData'

const topItems = [...mockRatings].sort((a, b) => b.score - a.score).slice(0, 10)
const topCafes = [...mockCafes].sort((a, b) => b.rating - a.rating).slice(0, 8)
const mostReviewed = [...mockCafes].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8)

export default function LeaderboardsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral pb-28 md:pb-10">
        <div className="px-4 py-5 md:max-w-5xl md:mx-auto">

          {/* Large title */}
          <h1 className="font-bold text-primary mb-1" style={{ fontSize: '34px' }}>Leaderboards</h1>
          <p className="text-primary-light text-[15px] mb-6">The best-rated items and cafes in Dublin.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Top rated items */}
            <section aria-label="Top rated items">
              <h2 className="text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1 flex items-center gap-1.5">
                <span className="text-accent">★</span> Top rated items
              </h2>
              <div className="bg-surface rounded-card overflow-hidden">
                {topItems.map((rating, i) => {
                  const cafe = mockCafes.find((c) => c.id === rating.cafeId)
                  return (
                    <div
                      key={rating.id}
                      className="flex items-center gap-3 px-4 py-3.5"
                      style={{ borderTop: i > 0 ? '0.5px solid rgba(0,0,0,0.10)' : undefined }}
                    >
                      <span className="text-[15px] font-bold tabular-nums text-primary-light w-6 text-right shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-medium text-primary truncate">{rating.itemName}</p>
                        {cafe && (
                          <Link
                            href={`/cafe/${cafe.id}`}
                            className="text-[13px] text-accent block truncate focus-visible:outline-none"
                          >
                            {cafe.name}
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-[17px] font-bold text-accent tabular-nums">{rating.score}</span>
                        <span className="text-accent text-[13px]" aria-hidden="true">★</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <div className="space-y-6">
              {/* Top rated cafes */}
              <section aria-label="Highest rated cafes">
                <h2 className="text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1 flex items-center gap-1.5">
                  <span className="text-accent">↑</span> Highest rated cafes
                </h2>
                <div className="bg-surface rounded-card overflow-hidden">
                  {topCafes.map((cafe, i) => (
                    <Link
                      key={cafe.id}
                      href={`/cafe/${cafe.id}`}
                      className="flex items-center gap-3 px-4 py-3.5 active:bg-neutral transition-colors focus-visible:outline-none focus-visible:bg-neutral"
                      style={{ borderTop: i > 0 ? '0.5px solid rgba(0,0,0,0.10)' : undefined }}
                    >
                      <span className="text-[15px] font-bold tabular-nums text-primary-light w-6 text-right shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-medium text-primary truncate">{cafe.name}</p>
                        <p className="text-[13px] text-primary-light truncate">{cafe.address}</p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-[17px] font-bold text-accent tabular-nums">{cafe.rating.toFixed(1)}</span>
                        <span className="text-accent text-[13px]" aria-hidden="true">★</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Most reviewed */}
              <section aria-label="Most reviewed cafes">
                <h2 className="text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1 flex items-center gap-1.5">
                  <span className="text-accent">#</span> Most reviewed cafes
                </h2>
                <div className="bg-surface rounded-card overflow-hidden">
                  {mostReviewed.map((cafe, i) => (
                    <Link
                      key={cafe.id}
                      href={`/cafe/${cafe.id}`}
                      className="flex items-center gap-3 px-4 py-3.5 active:bg-neutral transition-colors focus-visible:outline-none focus-visible:bg-neutral"
                      style={{ borderTop: i > 0 ? '0.5px solid rgba(0,0,0,0.10)' : undefined }}
                    >
                      <span className="text-[15px] font-bold tabular-nums text-primary-light w-6 text-right shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-medium text-primary truncate">{cafe.name}</p>
                        <p className="text-[13px] text-primary-light truncate">{cafe.address}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[17px] font-bold text-primary tabular-nums">{cafe.reviewCount}</p>
                        <p className="text-[11px] text-primary-light">reviews</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
