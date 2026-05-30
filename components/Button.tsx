import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-accent text-white active:opacity-70',
    secondary: 'bg-neutral-dark text-primary active:opacity-70',
    outline: 'border border-sep text-accent bg-transparent active:opacity-70',
    ghost: 'text-accent bg-transparent active:opacity-70',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-[15px]',
    md: 'px-5 py-3 text-[17px]',
    lg: 'px-7 py-4 text-[17px]',
  }

  return (
    <button
      className={`
        rounded-full font-semibold
        transition-opacity duration-100
        cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
