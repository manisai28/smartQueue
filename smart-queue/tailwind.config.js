/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        surface: {
          950: '#060811',
          900: '#0b0f1a',
          800: '#111827',
          700: '#1a2235',
          600: '#1f2d42',
          500: '#263348',
        },
        accent: {
          cyan: '#00d4ff',
          green: '#00ff8c',
          amber: '#ffb800',
          red: '#ff4560',
          purple: '#8b5cf6',
          blue: '#3b82f6',
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'ticker': 'ticker 20s linear infinite',
      },
      keyframes: {
        slideIn: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        ticker: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(-100%)' } },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,212,255,0.15)',
        'glow-green': '0 0 20px rgba(0,255,140,0.15)',
        'glow-amber': '0 0 20px rgba(255,184,0,0.15)',
        'glow-red': '0 0 20px rgba(255,69,96,0.15)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
