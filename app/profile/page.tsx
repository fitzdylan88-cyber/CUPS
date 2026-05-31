'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import Header from '@/components/Header'
import { useAuthStore, useAppStore } from '@/lib/store'
import { useTheme } from '@/components/ThemeProvider'
import type { ThemePreference } from '@/components/ThemeProvider'

export default function ProfilePage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)
  const userRatings = useAppStore((state) => state.userRatings)

  const { preference, setPreference } = useTheme()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [saved, setSaved] = useState(false)
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setName(user.name)
      setBio(user.bio ?? '')
    }
  }, [user, router])

  if (!user) return null

  const totalRatings = userRatings.length
  const uniqueCafes = new Set(userRatings.map((r) => r.cafeId)).size
  const avgScore = totalRatings > 0
    ? (userRatings.reduce((sum, r) => sum + r.score, 0) / totalRatings).toFixed(1)
    : '—'

  const memberSince = (() => {
    const d = user.createdAt ? new Date(user.createdAt) : null
    if (!d || isNaN(d.getTime())) return 'Recently'
    return new Intl.DateTimeFormat('en-IE', { month: 'long', year: 'numeric' }).format(d)
  })()

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Name cannot be empty.')
      return
    }
    setNameError('')
    setUser({ ...user!, name: name.trim(), bio: bio.trim() })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleLogout() {
    logout()
    signOut({ callbackUrl: '/' })
  }

  const chevron = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary-light/50" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral pb-28 md:pb-10">
        <div className="md:max-w-2xl md:mx-auto">

          {/* ── Hero / avatar ── */}
          <div
            className="px-4 pt-8 pb-6 flex flex-col items-center text-center"
            style={{ background: 'linear-gradient(180deg, #F5EFE6 0%, #F2F2F7 100%)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-[34px] mb-3 shadow-md"
              style={{ background: 'linear-gradient(135deg, #9B7950 0%, #5C4A2A 100%)' }}
              aria-hidden="true"
            >
              {user.name[0].toUpperCase()}
            </div>
            <p className="text-[22px] font-bold text-primary leading-tight">{user.name}</p>
            <p className="text-[14px] text-primary-light mt-0.5">{user.email}</p>
            {user.bio && (
              <p className="text-[14px] text-primary-light mt-2 max-w-xs leading-relaxed">{user.bio}</p>
            )}
            <p className="text-[12px] text-primary-light/60 mt-2">Member since {memberSince}</p>
          </div>

          {/* ── Stats strip ── */}
          <div className="mx-4 -mt-1 mb-5">
            <div className="bg-surface rounded-card shadow-card grid grid-cols-3 divide-x divide-black/[0.06]">
              {[
                { label: 'Cafes visited', value: uniqueCafes },
                { label: 'Items rated', value: totalRatings },
                { label: 'Avg score', value: avgScore },
              ].map((s) => (
                <div key={s.label} className="py-4 flex flex-col items-center gap-0.5">
                  <span className="text-[24px] font-bold text-primary tabular-nums leading-none">{s.value}</span>
                  <span className="text-[11px] text-primary-light text-center leading-snug">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 space-y-4">
            {/* Success toast */}
            {saved && (
              <p role="status" aria-live="polite" className="text-[15px] text-accent bg-accent/10 rounded-xl px-4 py-3 text-center">
                Profile updated.
              </p>
            )}

            {/* ── Edit form ── */}
            {editing ? (
              <form onSubmit={handleSave} noValidate>
                <h2 className="text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1">
                  Edit profile
                </h2>
                <div className="bg-surface rounded-card overflow-hidden">
                  <div className="px-4 py-3" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}>
                    <label htmlFor="profile-name" className="block text-[12px] text-primary-light mb-1">Display name</label>
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setNameError('') }}
                      className="w-full text-[17px] text-primary bg-transparent border-0 focus:outline-none"
                      autoComplete="name"
                      required
                    />
                    {nameError && <p className="text-[12px] mt-1" style={{ color: '#FF3B30' }}>{nameError}</p>}
                  </div>
                  <div className="px-4 py-3">
                    <label htmlFor="profile-bio" className="block text-[12px] text-primary-light mb-1">Bio (optional)</label>
                    <input
                      id="profile-bio"
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="A short intro about you…"
                      className="w-full text-[17px] text-primary bg-transparent border-0 focus:outline-none placeholder:text-primary-light/50"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-accent text-white font-semibold py-3 rounded-full text-[17px] active:opacity-70 transition-opacity"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setName(user.name); setBio(user.bio ?? ''); setNameError('') }}
                    className="bg-neutral-dark text-primary font-semibold py-3 px-5 rounded-full text-[17px] active:opacity-70 transition-opacity"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}

            {/* ── Activity section ── */}
            <div>
              <h2 className="text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1">Activity</h2>
              <div className="bg-surface rounded-card overflow-hidden">
                <Link
                  href="/passport"
                  className="flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
                  style={{ borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]" aria-hidden="true">📖</span>
                    <span className="text-[17px] text-primary">My Passport</span>
                  </div>
                  {chevron}
                </Link>
                <Link
                  href="/cafes"
                  className="flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]" aria-hidden="true">☕</span>
                    <span className="text-[17px] text-primary">Browse cafes</span>
                  </div>
                  {chevron}
                </Link>
              </div>
            </div>

            {/* ── Account section ── */}
            <div>
              <h2 className="text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1">Account</h2>
              <div className="bg-surface rounded-card overflow-hidden">
                {!editing && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70 transition-opacity"
                    style={{ borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[20px]" aria-hidden="true">✏️</span>
                      <span className="text-[17px] text-primary">Edit profile</span>
                    </div>
                    {chevron}
                  </button>
                )}
                <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}>
                  <span className="text-[17px] text-primary">Email</span>
                  <span className="text-[15px] text-primary-light truncate max-w-[180px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-[17px] text-primary">Member since</span>
                  <span className="text-[15px] text-primary-light">{memberSince}</span>
                </div>
              </div>
            </div>

            {/* ── Appearance ── */}
            <div>
              <h2 className="text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-2 px-1">Appearance</h2>
              <div className="bg-surface rounded-card overflow-hidden px-4 py-3.5">
                <p className="text-[17px] text-primary mb-3">Theme</p>
                <div className="flex bg-neutral rounded-xl p-1 gap-1">
                  {([
                    { value: 'system', label: '⚙️ System' },
                    { value: 'light',  label: '☀️ Light'  },
                    { value: 'dark',   label: '🌙 Dark'   },
                  ] as { value: ThemePreference; label: string }[]).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPreference(value)}
                      className={`flex-1 py-2 rounded-lg text-[14px] font-semibold transition-colors ${
                        preference === value
                          ? 'bg-surface text-primary shadow-card'
                          : 'text-primary-light'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-[12px] text-primary-light mt-2">
                  {preference === 'system'
                    ? 'Follows your device display settings automatically'
                    : preference === 'dark'
                    ? 'Always dark, regardless of device settings'
                    : 'Always light, regardless of device settings'}
                </p>
              </div>
            </div>

            {/* ── Sign out ── */}
            <div className="bg-surface rounded-card overflow-hidden">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-3.5 text-center text-[17px] font-medium active:opacity-60 transition-opacity"
                style={{ color: '#FF3B30' }}
              >
                Sign out
              </button>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
