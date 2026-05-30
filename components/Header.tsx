'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, Sun, Moon } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { useTheme } from './ThemeProvider'

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
  const { dark, toggle } = useTheme()

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
        background: 'var(--header-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid var(--border-color)',
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
            <ChevronLeft size={20} strokeWidth={2.5} />
            Cafes
          </Link>
        )}

        <span className="text-primary font-semibold" style={{ fontSize: '17px' }}>
          {pageTitle}
        </span>

        <div className="absolute right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-full text-primary-light active:opacity-60 transition-opacity"
          >
            {dark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
          </button>

          {pathname === '/' && (
            <Link
              href={user ? '/profile' : '/signup'}
              className="text-accent font-normal"
              style={{ fontSize: '17px' }}
            >
              {user ? 'Profile' : 'Sign Up'}
            </Link>
          )}
        </div>
      </div>

      {/* Desktop: full horizontal nav */}
      <div className="hidden md:flex container mx-auto px-6 py-3.5 items-center justify-between max-w-5xl">
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          aria-label="CUPS — home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dark ? '/logo-white.svg' : '/logo-dark.svg'} alt="CUPS" className="h-9 w-auto" />
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

          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-full text-primary-light hover:text-primary transition-colors focus-visible:outline-none"
          >
            {dark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
          </button>
        </nav>
      </div>
    </header>
  )
}
