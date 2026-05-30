'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

const PAGE_TITLES: Record<string, string> = {
  '/':             'CUPS',
  '/cafes':        'Cafes',
  '/leaderboards': 'Leaderboards',
  '/passport':     'My Passport',
  '/profile':      'Profile',
  '/login':        'Sign In',
  '/signup':       'Sign Up',
}

export default function Header() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  const isCafeDetail = pathname.startsWith('/cafe/')
  const pageTitle = isCafeDetail ? 'Cafe' : (PAGE_TITLES[pathname] ?? 'CUPS')

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1 py-0.5 ${
        pathname === href || pathname.startsWith(href + '/')
          ? 'text-accent font-semibold'
          : 'text-primary hover:text-accent'
      }`}
      aria-current={pathname === href ? 'page' : undefined}
    >
      {label}
    </Link>
  )

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(242,242,247,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid rgba(0,0,0,0.16)',
      }}
    >
      {/* Mobile: iOS-style compact nav bar */}
      <div className="md:hidden flex items-center justify-center h-11 px-4 relative">
        {isCafeDetail && (
          <Link
            href="/cafes"
            className="absolute left-3 flex items-center gap-0.5 text-accent text-[17px] font-normal focus-visible:outline-none"
            aria-label="Back to Cafes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Cafes
          </Link>
        )}

        <span className="text-primary font-semibold" style={{ fontSize: '17px' }}>
          {pageTitle}
        </span>

        {pathname === '/' && (
          <Link
            href={user ? '/profile' : '/signup'}
            className="absolute right-4 text-accent font-normal"
            style={{ fontSize: '17px' }}
          >
            {user ? 'Profile' : 'Sign Up'}
          </Link>
        )}
      </div>

      {/* Desktop: full horizontal nav */}
      <div className="hidden md:flex container mx-auto px-6 py-3.5 items-center justify-between max-w-5xl">
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          aria-label="CUPS — home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.svg" alt="CUPS" className="h-9 w-auto" />
        </Link>

        <nav className="flex gap-5 items-center" role="navigation" aria-label="Main navigation">
          {navLink('/cafes', 'Cafes')}
          {navLink('/leaderboards', 'Leaderboards')}

          {user ? (
            <>
              {navLink('/passport', 'My Passport')}
              {navLink('/profile', 'Profile')}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:text-accent transition-colors focus-visible:outline-none"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
