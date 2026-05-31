'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import { useAuthStore, useAppStore } from '@/lib/store'
import { mockCafes } from '@/lib/mockData'

interface Achievement {
  id: string
  icon: string
  label: string
  desc: string
  earned: boolean
  isNew?: boolean
  target: number
  progress: number
}

export default function PassportPage() {
  const user = useAuthStore((state) => state.user)
  const userRatings = useAppStore((state) => state.userRatings)

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral pb-28 md:pb-10 flex items-center justify-center px-4">
          <div className="text-center max-w-xs mx-auto">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h1 className="text-[22px] font-bold text-primary mb-2">Your Cafe Passport</h1>
            <p className="text-primary-light text-[15px] leading-relaxed mb-6">
              Sign up to stamp every cafe you visit and track every item you rate.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center bg-accent text-white font-semibold px-5 py-3 rounded-full text-[17px] active:opacity-70 transition-opacity">
                Create your passport
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center bg-surface text-accent font-semibold px-5 py-3 rounded-full text-[17px] active:opacity-70 transition-opacity">
                Sign in
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  const totalRatings = userRatings.length
  const visitedCafeIds = [...new Set(userRatings.map((r) => r.cafeId))]
  const uniqueCafes = visitedCafeIds.length
  const avgScore = totalRatings > 0
    ? (userRatings.reduce((sum, r) => sum + r.score, 0) / totalRatings).toFixed(1)
    : '—'
  const topScore = totalRatings > 0
    ? Math.max(...userRatings.map(r => r.score))
    : '—'

  const memberSince = new Intl.DateTimeFormat('en-IE', { month: 'short', year: 'numeric' }).format(user.createdAt ?? new Date())

  const achievements: Achievement[] = [
    { id: 'first-sip',     icon: '☕', label: 'First Sip',       desc: 'Rate your first item',    earned: totalRatings >= 1, isNew: totalRatings === 1, target: 1, progress: Math.min(totalRatings, 1) },
    { id: 'regular',       icon: '🏡', label: 'Regular',         desc: 'Visit 3 different cafes', earned: uniqueCafes >= 3,  target: 3, progress: Math.min(uniqueCafes, 3) },
    { id: 'connoisseur',   icon: '⭐', label: 'Connoisseur',     desc: 'Rate 5 items',            earned: totalRatings >= 5, target: 5, progress: Math.min(totalRatings, 5) },
    { id: 'around-dublin', icon: '🗺️', label: 'All Over Dublin', desc: 'Visit 5 cafes',           earned: uniqueCafes >= 5,  target: 5, progress: Math.min(uniqueCafes, 5) },
    { id: 'perfect',       icon: '🏆', label: 'Perfection',      desc: 'Give a 10/10 rating',     earned: userRatings.some(r => r.score === 10), target: 1, progress: userRatings.some(r => r.score === 10) ? 1 : 0 },
    { id: 'critic',        icon: '✍️', label: 'Critic',          desc: 'Write 3 notes',           earned: userRatings.filter(r => r.notes).length >= 3, target: 3, progress: Math.min(userRatings.filter(r => r.notes).length, 3) },
  ]

  const earnedCount = achievements.filter(a => a.earned).length

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral pb-28 md:pb-10">
        <div className="px-4 py-5 md:max-w-4xl md:mx-auto">

          {/* ── Passport card ── */}
          <div
            className="relative overflow-hidden rounded-[22px] mb-6 p-6"
            style={{ background: 'linear-gradient(135deg, #9B7950 0%, #5C4A2A 100%)' }}
          >
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ position: 'absolute', right: 30, bottom: -40, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

            <div className="relative">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[11px] tracking-[0.15em] text-white/50 uppercase font-semibold">CUPS Passport</p>
                  <h2 className="text-[26px] font-bold text-white mt-0.5 leading-tight">{user.name}</h2>
                  <p className="text-[13px] text-white/50 mt-0.5">Member since {memberSince}</p>
                </div>
                <span className="text-[52px] opacity-20 select-none leading-none">☕</span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Cafes', value: uniqueCafes },
                  { label: 'Items', value: totalRatings },
                  { label: 'Avg', value: avgScore },
                  { label: 'Best', value: topScore },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[24px] font-bold text-white tabular-nums leading-none">{s.value}</div>
                    <div className="text-[11px] text-white/50 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div
                className="border-t pt-3 font-mono text-[9px] text-white/25 tracking-[0.12em] leading-relaxed"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              >
                CUPS&lt;&lt;{user.name.toUpperCase().replace(/\s+/g, '<')}&lt;&lt;DUBLIN&lt;&lt;IRELAND
              </div>
            </div>
          </div>

          {/* ── Achievements ── */}
          <section className="mb-6" aria-label="Achievements">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[18px] font-bold text-primary">Achievements</h2>
              <span className="text-[13px] text-primary-light">{earnedCount}/{achievements.length} earned</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`bg-surface rounded-card shadow-card p-3 flex flex-col items-center text-center gap-1.5 relative ${
                    a.earned ? '' : 'opacity-40'
                  }`}
                >
                  {a.isNew && a.earned && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      New!
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[24px] ${
                    a.earned ? 'bg-accent/15' : 'bg-neutral-dark'
                  }`}>
                    {a.earned ? a.icon : '🔒'}
                  </div>
                  <p className="text-[12px] font-bold text-primary leading-tight">{a.label}</p>
                  <p className="text-[10px] text-primary-light leading-snug">{a.desc}</p>
                  {!a.earned && (
                    <p className="text-[10px] text-primary-light/60 font-semibold tabular-nums">
                      {a.progress} / {a.target}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Cafe stamps (all cafes, visited = colored, unvisited = locked) ── */}
          <section className="mb-6" aria-label="Cafe stamps">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[18px] font-bold text-primary">Stamp collection</h2>
              <span className="text-[13px] text-primary-light">{uniqueCafes}/{mockCafes.length} visited</span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {mockCafes.map((cafe) => {
                const visited = visitedCafeIds.includes(cafe.id)
                const cafeRatingCount = userRatings.filter(r => r.cafeId === cafe.id).length
                return (
                  <Link
                    key={cafe.id}
                    href={visited ? `/cafe/${cafe.id}` : '#'}
                    className={`bg-surface rounded-card shadow-card p-3 flex flex-col items-center gap-2 text-center transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      visited ? 'active:opacity-70' : 'opacity-45 cursor-default'
                    }`}
                    onClick={(e) => !visited && e.preventDefault()}
                    aria-label={visited ? `${cafe.name} — ${cafeRatingCount} items rated` : `${cafe.name} — not yet visited`}
                  >
                    {/* Stamp circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                      visited ? 'bg-accent/15 border-2 border-accent/30' : 'bg-neutral-dark border-2 border-neutral-dark'
                    }`}>
                      {visited ? (
                        <span className="text-[20px] font-bold text-accent">{cafe.name[0].toUpperCase()}</span>
                      ) : (
                        <span className="text-[20px] font-bold text-primary-light/30">{cafe.name[0].toUpperCase()}</span>
                      )}
                    </div>
                    <p className="text-[12px] font-semibold text-primary leading-tight line-clamp-2">{cafe.name}</p>
                    <p className="text-[11px] text-primary-light">
                      {visited ? `${cafeRatingCount} item${cafeRatingCount !== 1 ? 's' : ''}` : 'Not yet stamped'}
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* ── Recent ratings ── */}
          {userRatings.length > 0 && (
            <section aria-label="Your ratings">
              <h2 className="text-[18px] font-bold text-primary mb-3">Your ratings</h2>
              <div className="bg-surface rounded-card shadow-card overflow-hidden">
                {userRatings.map((rating, i) => {
                  const cafe = mockCafes.find((c) => c.id === rating.cafeId)
                  const formattedDate = new Intl.DateTimeFormat('en-IE', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  }).format(new Date(rating.createdAt))
                  return (
                    <div
                      key={rating.id}
                      className="px-4 py-3.5 flex items-center gap-3"
                      style={{ borderTop: i > 0 ? '0.5px solid rgba(0,0,0,0.10)' : undefined }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[17px] font-medium text-primary truncate">{rating.itemName}</p>
                        {cafe ? (
                          <Link href={`/cafe/${cafe.id}`} className="text-[13px] text-accent block truncate">
                            {cafe.name}
                          </Link>
                        ) : null}
                        <time className="text-[12px] text-primary-light">{formattedDate}</time>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <span className="text-[20px] font-bold text-accent tabular-nums">{rating.score}</span>
                        <span className="text-accent text-[13px]">★</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {userRatings.length === 0 && (
            <div className="bg-surface rounded-card shadow-card p-10 text-center">
              <p className="text-primary-light text-[15px] mb-5">Start rating items to earn your first stamp.</p>
              <Link href="/cafes" className="inline-flex items-center bg-accent text-white font-semibold px-5 py-2.5 rounded-full text-[15px] active:opacity-70">
                Find your first cafe
              </Link>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
