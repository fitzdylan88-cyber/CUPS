'use client'

import { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Rate an item"
    >
      <div className="bg-surface w-full max-w-lg rounded-t-3xl sm:rounded-card p-6 pb-safe overscroll-contain max-h-[92dvh] overflow-y-auto animate-sheet-in">
        <div className="w-9 h-1 bg-neutral-dark rounded-full mx-auto mb-4 sm:hidden" aria-hidden="true" />

        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[20px] font-bold text-primary">Rate an item</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral text-primary-light active:opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
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
                  <Camera size={24} strokeWidth={1.5} className="text-primary-light" aria-hidden="true" />
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
