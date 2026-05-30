'use client'

import { SessionProvider } from 'next-auth/react'
import BottomTabBar from './BottomTabBar'
import RateFAB from './RateFAB'
import AuthProvider from './AuthProvider'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider />
      {children}
      <BottomTabBar />
      <RateFAB />
    </SessionProvider>
  )
}
