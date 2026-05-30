import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  role?: string
  tabIndex?: number
  'aria-label'?: string
}

export default function Card({ children, className = '', onClick, ...props }: CardProps) {
  const isInteractive = Boolean(onClick)

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={`
        bg-surface rounded-card p-5
        ${isInteractive ? 'cursor-pointer active:opacity-70 transition-opacity duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2' : ''}
        ${className}
      `}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? (props.role ?? 'button') : undefined}
      tabIndex={isInteractive ? (props.tabIndex ?? 0) : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
