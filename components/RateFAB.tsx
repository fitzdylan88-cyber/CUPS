'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Plus, X, Search } from 'lucide-react'
import { useAuthStore, useAppStore } from '@/lib/store'
import RatingForm from './RatingForm'

const HIDE_ON = ['/login', '/signup']

export default function RateFAB() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const cafes = useAppStore((s) => s.cafes)
  const addRating = useAppStore((s) => s.addRating)

  const [step, setStep] = useState<'idle' | 'pick' | 'rate'>('idle')
  const [search, setSearch] = useState('')
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null)

  if (HIDE_ON.includes(pathname)) return null

  const selectedCafe = cafes.find((c) => c.id === selectedCafeId)
  const filtered = search.trim()
    ? cafes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : cafes

  function handleClose() {
    setStep('idle')
    setSearch('')
    setSelectedCafeId(null)
  }

  return (
    <>
      {/* FAB button */}
      <button
        type="button"
        onClick={() => setStep('pick')}
        aria-label="Rate an item"
        className="fixed z-40 md:bottom-6 md:right-6 bottom-[calc(64px+env(safe-area-inset-bottom)+12px)] right-4 w-14 h-14 rounded-full bg-accent text-white shadow-modal flex items-center justify-center active:opacity-70 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <Plus size={28} strokeWidth={2.5} aria-hidden="true" />
      </button>

      {/* Cafe picker sheet */}
      {step === 'pick' && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
          role="dialog"
          aria-modal="true"
          aria-label="Choose a cafe to rate"
        >
          <div className="bg-surface w-full max-w-lg rounded-t-3xl sm:rounded-card pb-safe overflow-hidden flex flex-col max-h-[80dvh] animate-sheet-in">
            <div className="w-9 h-1 bg-neutral-dark rounded-full mx-auto mt-4 mb-3 sm:hidden" aria-hidden="true" />

            <div className="flex items-center justify-between px-5 pb-3" style={{ borderBottom: '0.5px solid var(--border-color)' }}>
              <h2 className="text-[18px] font-bold text-primary">Choose a cafe</h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral text-primary-light active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="px-4 py-3" style={{ borderBottom: '0.5px solid var(--border-color)' }}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-light pointer-events-none" aria-hidden="true">
                  <Search size={16} strokeWidth={1.8} />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cafes…"
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral rounded-xl text-[17px] text-primary placeholder:text-primary-light/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {!user && (
                <div className="px-5 py-4 text-center">
                  <p className="text-[15px] text-primary-light mb-3">Sign in to rate items</p>
                  <a href="/login" className="inline-flex items-center bg-accent text-white font-semibold px-5 py-2.5 rounded-full text-[15px]">Sign in</a>
                </div>
              )}
              {user && filtered.map((cafe, i) => (
                <button
                  key={cafe.id}
                  type="button"
                  onClick={() => { setSelectedCafeId(cafe.id); setStep('rate') }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3.5 active:bg-neutral transition-colors focus-visible:outline-none focus-visible:bg-neutral"
                  style={{ borderTop: i > 0 ? '0.5px solid var(--border-color)' : undefined }}
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="text-[16px] font-bold text-accent">{cafe.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] font-medium text-primary truncate">{cafe.name}</p>
                    <p className="text-[13px] text-primary-light truncate">{cafe.address}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span className="text-[15px] font-bold text-accent tabular-nums">{cafe.rating.toFixed(1)}</span>
                    <span className="text-accent text-[11px]" aria-hidden="true">★</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rating form */}
      {step === 'rate' && selectedCafe && user && (
        <RatingForm
          cafeId={selectedCafe.id}
          cafeName={selectedCafe.name}
          userId={user.id}
          onClose={handleClose}
          onSave={(rating) => { addRating(rating); handleClose() }}
        />
      )}
    </>
  )
}
