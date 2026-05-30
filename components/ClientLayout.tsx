'use client'

import { SessionProvider } from 'next-auth/react'
import BottomTabBar from './BottomTabBar'
import RateFAB from './RateFAB'
import AuthProvider from './AuthProvider'
import ThemeProvider from './ThemeProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AuthProvider />
        {children}
        <BottomTabBar />
        <RateFAB />
      </SessionProvider>
    </ThemeProvider>
  )
}
