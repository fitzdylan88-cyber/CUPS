import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS custom property tokens — swap automatically on .dark
        'primary':       'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'accent':        '#8B6F47',   // brand stays fixed
        'accent-light':  '#A0826D',
        'neutral':       'var(--color-neutral)',
        'neutral-dark':  'var(--color-neutral-dark)',
        'surface':       'var(--color-surface)',
        'sep':           'var(--color-sep)',
        'ios-red':       '#FF3B30',
        'ios-blue':      '#007AFF',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        'card': '20px',
        'lg':   '10px',
        'xl':   '16px',
        '2xl':  '20px',
        '3xl':  '28px',
      },
      boxShadow: {
        'soft':  '0 1px 4px rgba(0,0,0,0.06)',
        'card':  '0 1px 4px rgba(0,0,0,0.06)',
        'hover': '0 2px 12px rgba(0,0,0,0.10)',
        'modal': '0 8px 40px rgba(0,0,0,0.20)',
        'tab':   '0 -0.5px 0 rgba(0,0,0,0.18)',
      },
      ringColor: {
        DEFAULT: '#8B6F47',
        accent:  '#8B6F47',
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
export default config
