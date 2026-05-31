'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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

const TOP_LEVEL_PATHS = ['/', '/cafes', '/leaderboards', '/passport', '/profile']

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { dark, toggle } = useTheme()

  const isTopLevel = TOP_LEVEL_PATHS.includes(pathname)
  const pageTitle = PAGE_TITLES[pathname] ?? (pathname.startsWith('/cafe/') ? 'Cafe' : 'CUPS')

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

  const isHome = pathname === '/'
  const showBack = !isHome && !isTopLevel

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
      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center h-[52px] px-4">

        {/* Left — logo on home, back button on all sub-pages */}
        {isHome ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dark ? '/logo-white.svg' : '/logo-dark.svg'} alt="CUPS" className="h-7 w-auto" />
        ) : showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-0.5 text-accent text-[17px] font-normal focus-visible:outline-none"
            aria-label="Go back"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            Back
          </button>
        ) : null}

        {/* Centre — page title on all non-home pages */}
        {!isHome && (
          <span className="absolute left-1/2 -translate-x-1/2 text-primary font-semibold" style={{ fontSize: '17px' }}>
            {pageTitle}
          </span>
        )}

        {/* Right — theme toggle + profile avatar */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 flex items-center justify-center rounded-full text-primary-light active:opacity-60 transition-opacity"
          >
            {dark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
          </button>

          <Link
            href={user ? '/profile' : '/login'}
            aria-label={user ? 'Profile' : 'Sign in'}
          >
            {user ? (
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-[13px] select-none">
                {user.name[0].toUpperCase()}
              </div>
            ) : (
              <span className="text-[15px] text-accent font-medium">Sign in</span>
            )}
          </Link>
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
