import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f0ebe3',
        surface: '#faf8f5',
        border: '#e5e0d8',
        'text-primary': '#1a1a1a',
        'text-muted': '#6b6b6b',
        accent: '#e8521a',
        navy: '#1a1a2e',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
