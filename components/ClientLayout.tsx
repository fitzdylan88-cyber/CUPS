'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import BottomTabBar from './BottomTabBar'
import RateFAB from './RateFAB'
import AuthProvider from './AuthProvider'
import ThemeProvider from './ThemeProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AuthProvider />
        <Toaster position="top-center" richColors />
        {children}
        <BottomTabBar />
        <RateFAB />
      </SessionProvider>
    </ThemeProvider>
  )
}
