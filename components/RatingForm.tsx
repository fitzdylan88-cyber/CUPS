'use client'

import { useState, useRef } from 'react'
import Button from './Button'
import { Rating } from '@/lib/types'

interface Props {
  cafeId: string
  cafeName: string
  userId: string
  onClose: () => void
  onSave: (rating: Rating) => void
}

export default function RatingForm({ cafeId, cafeName, userId, onClose, onSave }: Props) {
  const [itemName, setItemName] = useState('')
  const [score, setScore] = useState(7)
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!itemName.trim()) { setError('Please enter the item name.'); return }
    onSave({
      id: `r-${Date.now()}`,
      userId,
      cafeId,
      itemName: itemName.trim(),
      score,
      photo,
      notes: notes.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Rate an item"
    >
      <div className="bg-surface w-full max-w-lg rounded-t-3xl sm:rounded-card p-6 pb-safe overscroll-contain max-h-[92dvh] overflow-y-auto">
        <div className="w-9 h-1 bg-neutral-dark rounded-full mx-auto mb-4 sm:hidden" aria-hidden="true" />

        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[20px] font-bold text-primary">Rate an item</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral text-primary-light active:opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-[14px] text-accent font-medium mb-5">{cafeName}</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Photo */}
          <div className="mb-4">
            <span className="block text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1">
              Photo <span className="font-normal normal-case">(optional)</span>
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-28 rounded-xl bg-neutral border-2 border-dashed border-neutral-dark flex flex-col items-center justify-center gap-2 active:opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 overflow-hidden"
              aria-label={photo ? 'Change photo' : 'Add a photo'}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Item preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-light" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                  </svg>
                  <span className="text-[13px] text-primary-light">Tap to add a photo</span>
                </>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="sr-only" aria-hidden="true" tabIndex={-1} />
          </div>

          {/* Item name */}
          <div className="mb-4">
            <label htmlFor="fab-item-name" className="block text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1">
              Item name <span aria-hidden="true" className="text-ios-red">*</span>
            </label>
            <input
              id="fab-item-name"
              type="text"
              value={itemName}
              onChange={(e) => { setItemName(e.target.value); setError('') }}
              placeholder="e.g. Flat White, Croissant…"
              className="w-full px-4 py-3.5 rounded-xl text-[17px] text-primary bg-neutral border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 placeholder:text-primary-light/50 transition-shadow"
              required
              autoFocus
            />
          </div>

          {/* Score */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3 px-1">
              <label htmlFor="fab-score" className="text-[13px] font-semibold text-primary-light uppercase tracking-wide">Score</label>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[28px] font-bold text-accent tabular-nums leading-none">{score}</span>
                <span className="text-primary-light text-[17px]">/10</span>
              </div>
            </div>
            <input
              id="fab-score"
              type="range" min={1} max={10} step={1} value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-dark rounded-full appearance-none cursor-pointer accent-accent"
              aria-valuenow={score} aria-valuemin={1} aria-valuemax={10} aria-valuetext={`${score} out of 10`}
            />
            <div className="flex justify-between text-[11px] text-primary-light mt-1.5 px-0.5">
              <span>Terrible</span><span>Perfect</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label htmlFor="fab-notes" className="block text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1">
              Notes <span className="text-primary-light font-normal normal-case">(optional)</span>
            </label>
            <textarea
              id="fab-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any thoughts on this item…"
              rows={3}
              className="w-full px-4 py-3.5 rounded-xl text-[17px] text-primary bg-neutral border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 placeholder:text-primary-light/50 transition-shadow resize-none"
            />
          </div>

          {error && <p role="alert" className="text-ios-red text-[13px] mb-3 px-1">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">Save rating</Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
