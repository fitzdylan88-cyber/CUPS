import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  id: string
}

export default function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="block text-[13px] font-semibold text-primary-light uppercase tracking-wide mb-1 px-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-4 py-3.5 rounded-xl text-primary
          bg-surface border-0
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
          transition-shadow duration-150
          placeholder:text-primary-light/60
          text-[17px]
          disabled:opacity-40 disabled:cursor-not-allowed
          ${error ? 'ring-2 ring-ios-red/60' : ''}
          ${className}
        `}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-ios-red text-[13px] mt-1.5 px-1">
          {error}
        </p>
      )}
    </div>
  )
}
