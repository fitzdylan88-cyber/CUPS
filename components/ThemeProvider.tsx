'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'

interface ThemeContextValue {
  dark: boolean
  preference: ThemePreference
  setPreference: (p: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  dark: false,
  preference: 'system',
  setPreference: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system')
  const [systemDark, setSystemDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // On mount: read saved preference and current system value
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(mq.matches)

    const saved = localStorage.getItem('cups-theme') as ThemePreference | null
    setPreferenceState(saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system')
    setMounted(true)

    // Listen for system theme changes in real-time
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Persist preference when user changes it
  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p)
    localStorage.setItem('cups-theme', p)
  }

  // Resolved dark value
  const dark = preference === 'system' ? systemDark : preference === 'dark'

  // Apply .dark class to <html>
  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', dark)
  }, [dark, mounted])

  return (
    <ThemeContext.Provider value={{ dark, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  )
}
