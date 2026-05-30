import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // iOS system colors mapped to existing token names
        'primary':       '#1C1C1E',   // label
        'primary-light': '#636366',   // secondaryLabel (WCAG AA compliant)
        'accent':        '#8B6F47',   // brand tint
        'accent-light':  '#A0826D',
        'neutral':       '#F2F2F7',   // systemGroupedBackground
        'neutral-dark':  '#E5E5EA',   // separator (opaque)
        'surface':       '#FFFFFF',   // secondarySystemGroupedBackground
        'sep':           '#C6C6C8',   // separator
        'ios-red':       '#FF3B30',   // destructive
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
