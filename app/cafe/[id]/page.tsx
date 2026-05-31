'use client'

import { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Coffee } from 'lucide-react'
import { toast } from 'sonner'
import Header from '@/components/Header'
import Button from '@/components/Button'
import RatingForm from '@/components/RatingForm'
import { useAuthStore, useAppStore } from '@/lib/store'
import { mockRatings } from '@/lib/mockData'
import { Rating } from '@/lib/types'

// Derive attribute chips from rating notes keywords
function getAttributes(ratings: typeof mockRatings): string[] {
  const notes = ratings.map(r => (r.notes || '').toLowerCase()).join(' ')
  const attrs: string[] = []
  if (notes.includes('smooth') || notes.includes('silky') || notes.includes('balanced')) attrs.push('Smooth coffee')
  if (notes.includes('bright') || notes.includes('fruity') || notes.includes('clean')) attrs.push('Specialty roast')
  if (notes.includes('moist') || notes.includes('fresh') || notes.includes('generous')) attrs.push('Great food')
  if (notes.includes('friendly') || notes.includes('nice') || notes.includes('cosy')) attrs.push('Cosy vibe')
  if (attrs.length < 3) {
    const defaults = ['Good espresso', 'Worth the visit', 'Great atmosphere']
    for (const d of defaults) {
      if (!attrs.includes(d)) attrs.push(d)
      if (attrs.length >= 4) break
    }
  }
  return attrs.slice(0, 5)
}

export default function CafeDetailPage() {
  const params = useParams()
  const user = useAuthStore((state) => state.user)
  const cafes = useAppStore((state) => state.cafes)
  const addRating = useAppStore((state) => state.addRating)
  const userRatings = useAppStore((state) => state.userRatings)

  const cafe = cafes.find((c) => c.id === params.id)
  const communityRatings = mockRatings.filter((r) => r.cafeId === params.id)
  const myRatings = userRatings.filter((r) => r.cafeId === params.id)
  const allRatings = [...communityRatings, ...myRatings]

  const [showRatingForm, setShowRatingForm] = useState(false)
  const [reviewFilter, setReviewFilter] = useState<'all' | 'high' | 'recent'>('recent')
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set())

  // All hooks must be called before any early return
  const topItems = useMemo(() => {
    return [...allRatings]
      .sort((a, b) => b.score - a.score)
      .reduce((acc: typeof allRatings, r) => {
        if (!acc.find(x => x.itemName.toLowerCase() === r.itemName.toLowerCase())) acc.push(r)
        return acc
      }, [])
      .slice(0, 8)
  }, [allRatings])

  const quotes = useMemo(() => allRatings.filter(r => r.notes), [allRatings])

  const distribution = useMemo(() => {
    const maxCount = allRatings.length || 1
    return [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(score => ({
      score,
      count: allRatings.filter(r => r.score === score).length,
      pct: Math.round((allRatings.filter(r => r.score === score).length / maxCount) * 100),
    }))
  }, [allRatings])

  const photos = useMemo(() => allRatings.filter(r => r.photo && r.photo !== ''), [allRatings])

  const filteredReviews = useMemo(() => {
    const base = [...allRatings]
    if (reviewFilter === 'high') return base.sort((a, b) => b.score - a.score)
    return base.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [allRatings, reviewFilter])

  if (!cafe) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-[22px] font-bold text-primary mb-2">Cafe not found</h1>
            <p className="text-primary-light mb-5">This cafe doesn&apos;t exist yet.</p>
            <Link href="/cafes" className="text-accent font-semibold">Browse all cafes</Link>
          </div>
        </main>
      </>
    )
  }

  const communityAvg = allRatings.length > 0
    ? allRatings.reduce((s, r) => s + r.score, 0) / allRatings.length
    : null

  const myAvg = myRatings.length > 0
    ? myRatings.reduce((s, r) => s + r.score, 0) / myRatings.length
    : null

  const attributes = getAttributes(communityRatings)

  // Hero gradient based on cafe id
  const heroGrads = [
    ['#D4A574', '#8B6F47'],
    ['#C8A96E', '#7A5C3A'],
    ['#E8C99A', '#9B7950'],
    ['#B8956A', '#6B4F2F'],
    ['#DDB68A', '#8B6840'],
    ['#C4956B', '#70472A'],
  ]
  const [fromColor, toColor] = heroGrads[parseInt(cafe.id) % heroGrads.length]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral pb-28 md:pb-10">
        <div className="md:max-w-4xl md:mx-auto">

          {/* ── Hero ── */}
          <div
            className="w-full flex items-end px-5 pb-5 relative"
            style={{ height: 220, background: `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)` }}
          >
            <span
              className="absolute right-6 top-4 font-bold text-white/15 select-none"
              style={{ fontSize: 120, lineHeight: 1 }}
            >
              {cafe.name[0]}
            </span>
            <div className="relative">
              <h1 className="text-[28px] font-bold text-white leading-tight">{cafe.name}</h1>
              <p className="text-[14px] text-white/70 mt-0.5">{cafe.address}</p>
            </div>
          </div>

          <div className="px-4 py-5 flex flex-col gap-6">

            {/* ── Score breakdown ── */}
            <div className="bg-surface rounded-card shadow-card p-5">
              <div className="flex items-stretch gap-4">
                {/* Community score */}
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-semibold text-primary-light uppercase tracking-wide mb-1">Community</p>
                  {communityAvg !== null ? (
                    <>
                      <div className="text-[40px] font-bold text-accent tabular-nums leading-none">{communityAvg.toFixed(1)}</div>
                      <p className="text-[12px] text-primary-light mt-1">{allRatings.length} {allRatings.length === 1 ? 'rating' : 'ratings'}</p>
                    </>
                  ) : (
                    <div className="text-[22px] font-bold text-primary-light/40">—</div>
                  )}
                </div>

                <div style={{ width: '0.5px', background: 'rgba(0,0,0,0.10)' }} />

                {/* Your score */}
                <div className="flex-1 text-center">
                  <p className="text-[11px] font-semibold text-primary-light uppercase tracking-wide mb-1">Your score</p>
                  {myAvg !== null ? (
                    <>
                      <div className="text-[40px] font-bold text-accent tabular-nums leading-none">{myAvg.toFixed(1)}</div>
                      <p className="text-[12px] text-primary-light mt-1">{myRatings.length} {myRatings.length === 1 ? 'item' : 'items'} rated</p>
                    </>
                  ) : (
                    <div className="text-[22px] font-bold text-primary-light/40 mt-1">—</div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: '0.5px solid rgba(0,0,0,0.10)' }}>
                {user ? (
                  <Button onClick={() => setShowRatingForm(true)} size="sm">+ Rate an item</Button>
                ) : (
                  <p className="text-[15px] text-primary-light">
                    <Link href="/login" className="text-accent font-semibold">Sign in</Link> to rate an item here.
                  </p>
                )}
              </div>
            </div>

            {/* ── Attribute chips ── */}
            <div className="flex gap-2 flex-wrap">
              {attributes.map((attr) => (
                <span
                  key={attr}
                  className="px-3 py-1.5 rounded-full text-[13px] font-medium text-accent bg-accent/10"
                >
                  {attr}
                </span>
              ))}
            </div>

            {/* ── Top items ── */}
            {topItems.length > 0 && (
              <section aria-label="Top rated items">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[18px] font-bold text-primary">Top items</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4">
                  {topItems.map((item) => (
                    <div
                      key={item.id}
                      className="shrink-0 bg-surface rounded-card shadow-card p-4 flex flex-col gap-2"
                      style={{ width: 140 }}
                    >
                      <div className="w-full h-16 rounded-xl bg-accent/10 flex items-center justify-center">
                        {item.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.photo} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Coffee size={28} className="text-accent/40" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-[14px] font-semibold text-primary leading-tight line-clamp-2">{item.itemName}</p>
                      <div className="flex items-center gap-0.5">
                        <span className="text-[15px] font-bold text-accent tabular-nums">{item.score}</span>
                        <span className="text-accent text-[11px]">★</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── People say ── */}
            {quotes.length > 0 && (
              <section aria-label="What people say">
                <h2 className="text-[18px] font-bold text-primary mb-3">People say</h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className="shrink-0 bg-surface rounded-card shadow-card p-4 flex flex-col justify-between gap-3"
                      style={{ width: 220 }}
                    >
                      <p className="text-[14px] text-primary leading-snug line-clamp-4 italic">&ldquo;{q.notes}&rdquo;</p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-[11px] shrink-0">
                            {('user' in q ? (q as { user: { name: string } }).user.name[0] : '?')}
                          </div>
                          <span className="text-[12px] text-primary-light truncate">
                            {'user' in q ? (q as { user: { name: string } }).user.name : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <span className="text-[13px] font-bold text-accent">{q.score}</span>
                          <span className="text-accent text-[10px]">★</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Rating distribution ── */}
            {allRatings.length > 0 && (
              <section aria-label="Rating breakdown">
                <div className="flex items-start gap-5 bg-surface rounded-card shadow-card p-5">
                  <div className="text-center shrink-0">
                    <div className="text-[42px] font-bold text-accent tabular-nums leading-none">
                      {allRatings.length}
                    </div>
                    <div className="text-[12px] text-primary-light mt-1">ratings</div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    {distribution.filter(d => d.score >= 7 || d.count > 0).map(({ score, pct, count }) => (
                      <div key={score} className="flex items-center gap-2">
                        <span className="text-[11px] text-primary-light w-3 text-right shrink-0">{score}</span>
                        <div className="flex-1 h-2 bg-neutral-dark rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-primary-light w-4 text-right shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Photo gallery ── */}
            {photos.length > 0 && (
              <section aria-label="Photos">
                <h2 className="text-[18px] font-bold text-primary mb-3">Photos</h2>
                <div className="grid grid-cols-3 gap-2">
                  {photos.slice(0, 6).map((p, i) => (
                    <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden bg-accent/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.photo!} alt={p.itemName} className="w-full h-full object-cover" />
                      {i === 5 && photos.length > 6 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-[16px]">+{photos.length - 6}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Community reviews ── */}
            <section aria-label="Community ratings">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[18px] font-bold text-primary">
                  {allRatings.length > 0 ? `Reviews (${allRatings.length})` : 'No reviews yet'}
                </h2>
                {allRatings.length > 1 && (
                  <div className="flex gap-1.5">
                    {(['recent', 'high'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setReviewFilter(f)}
                        className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                          reviewFilter === f ? 'bg-accent text-white' : 'bg-surface text-primary-light shadow-card'
                        }`}
                      >
                        {f === 'recent' ? 'Newest' : 'Highest'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {allRatings.length === 0 ? (
                <div className="bg-surface rounded-card shadow-card p-10 text-center">
                  <p className="text-primary-light text-[15px]">Be the first to rate an item here.</p>
                </div>
              ) : (
                <div className="bg-surface rounded-card shadow-card overflow-hidden">
                  {filteredReviews.map((rating, i) => (
                    <ReviewRow
                      key={rating.id}
                      rating={rating}
                      index={i}
                      helpful={helpfulIds.has(rating.id)}
                      onHelpful={() => setHelpfulIds(prev => {
                        const next = new Set(prev)
                        next.has(rating.id) ? next.delete(rating.id) : next.add(rating.id)
                        return next
                      })}
                    />
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </main>

      {/* Rating form modal */}
      {showRatingForm && user && (
        <RatingForm
          cafeId={cafe.id}
          cafeName={cafe.name}
          userId={user.id}
          onClose={() => setShowRatingForm(false)}
          onSave={(rating) => {
            addRating(rating)
            setShowRatingForm(false)
            toast.success('Rating saved!')
          }}
        />
      )}
    </>
  )
}

// ─── ReviewRow ────────────────────────────────────────────────────────────────

type AnyRating = (typeof mockRatings)[0] | Rating

function ReviewRow({ rating, index, helpful, onHelpful }: {
  rating: AnyRating; index: number; helpful: boolean; onHelpful: () => void
}) {
  const formattedDate = new Intl.DateTimeFormat('en-IE', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(rating.createdAt))

  const userName = 'user' in rating ? (rating as { user: { name: string } }).user.name : 'You'
  const userAvatar = 'user' in rating ? (rating as { user: { avatar?: string } }).user.avatar : undefined

  return (
    <div
      className="px-4 py-4 flex gap-3"
      style={{ borderTop: index > 0 ? '0.5px solid rgba(0,0,0,0.10)' : undefined }}
    >
      {rating.photo && rating.photo !== '' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={rating.photo} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
      ) : userAvatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={userAvatar} alt={userName} className="w-9 h-9 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-[15px] shrink-0">
          {userName[0].toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="min-w-0">
            <span className="text-[15px] font-semibold text-primary">{userName}</span>
            <span className="mx-1.5 text-neutral-dark">·</span>
            <span className="text-[15px] text-accent font-medium">{rating.itemName}</span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="text-[17px] font-bold text-accent tabular-nums">{rating.score}</span>
            <span className="text-[13px] text-accent">★</span>
          </div>
        </div>
        {rating.notes && (
          <p className="text-[14px] text-primary-light leading-relaxed mt-1">{rating.notes}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <time className="text-[12px] text-primary-light" dateTime={rating.createdAt.toString()}>
            {formattedDate}
          </time>
          <button
            type="button"
            onClick={onHelpful}
            className={`flex items-center gap-1 text-[12px] font-medium transition-colors ${
              helpful ? 'text-accent' : 'text-primary-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill={helpful ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
            </svg>
            Helpful
          </button>
        </div>
      </div>
    </div>
  )
}

