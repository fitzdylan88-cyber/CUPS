'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/lib/store'

/**
 * Bridges NextAuth session → Zustand auth store so existing UI
 * components that read from useAuthStore continue to work unchanged.
 */
export default function AuthProvider() {
  const { data: session, status } = useSession()
  const loginStore = useAuthStore((s) => s.login)
  const logoutStore = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (status === 'loading') return
    if (session?.user) {
      loginStore(
        {
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.name ?? '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ''
      )
    } else {
      logoutStore()
    }
  }, [session, status, loginStore, logoutStore])

  return null
}
