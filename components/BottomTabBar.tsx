'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MapPin, BookOpen, User } from 'lucide-react'

const HIDE_ON = ['/login', '/signup']

const tabs = [
  { href: '/',         label: 'Discover', Icon: Home },
  { href: '/cafes',    label: 'Cafes',    Icon: MapPin },
  { href: '/passport', label: 'Passport', Icon: BookOpen },
  { href: '/profile',  label: 'Profile',  Icon: User },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  if (HIDE_ON.includes(pathname)) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden"
      role="navigation"
      aria-label="Tab bar"
      style={{
        background: 'var(--tab-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid var(--border-color)',
      }}
    >
      <div className="flex items-stretch h-[64px] pb-safe">
        {tabs.map((tab) => {
          const isActive = tab.href === '/'
            ? pathname === '/'
            : pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-[3px] transition-opacity duration-100 active:opacity-60 ${
                isActive ? 'text-accent' : 'text-primary-light'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <tab.Icon size={26} strokeWidth={isActive ? 2.2 : 1.8} fill={isActive ? 'currentColor' : 'none'} />
              <span className="leading-none font-medium" style={{ fontSize: '10px' }}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
