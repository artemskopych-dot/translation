import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0d12',
        card: '#111522',
        accent: '#36C6F4'
      }
    },
  },
  plugins: [],
} satisfies Config
