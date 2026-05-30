'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        // Create account first, then sign in
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Could not create account. Please try again.')
          return
        }
      }

      // Sign in via NextAuth credentials provider
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password.')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Logo */}
      <div className="text-center mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-dark.svg" alt="CUPS" className="h-14 w-auto mx-auto mb-4" />
        <h1 className="text-[28px] font-bold text-primary">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-primary-light text-[15px] mt-1">
          {mode === 'login' ? 'Sign in to your CUPS account' : 'Start building your cafe passport'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Fields grouped iOS-style */}
        <div className="bg-surface rounded-card overflow-hidden mb-4">
          {mode === 'signup' && (
            <div className="px-4 py-3.5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}>
              <label htmlFor="name" className="block text-[12px] text-primary-light mb-1">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
                className="w-full text-[17px] text-primary bg-transparent border-0 focus:outline-none placeholder:text-primary-light/50"
              />
            </div>
          )}
          <div
            className="px-4 py-3.5"
            style={{ borderBottom: '0.5px solid rgba(0,0,0,0.10)' }}
          >
            <label htmlFor="email" className="block text-[12px] text-primary-light mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              spellCheck={false}
              required
              className="w-full text-[17px] text-primary bg-transparent border-0 focus:outline-none placeholder:text-primary-light/50"
            />
          </div>
          <div className="px-4 py-3.5">
            <label htmlFor="password" className="block text-[12px] text-primary-light mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              className="w-full text-[17px] text-primary bg-transparent border-0 focus:outline-none placeholder:text-primary-light/50"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-ios-red text-[13px] mb-4 text-center px-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white font-semibold py-3.5 rounded-full text-[17px] active:opacity-70 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 mb-4"
        >
          {loading ? 'Loading…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-[15px] text-center text-primary-light">
        {mode === 'login' ? (
          <>Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-accent font-semibold focus-visible:outline-none">Sign up</Link>
          </>
        ) : (
          <>Already have an account?{' '}
            <Link href="/login" className="text-accent font-semibold focus-visible:outline-none">Sign in</Link>
          </>
        )}
      </p>
    </div>
  )
}
