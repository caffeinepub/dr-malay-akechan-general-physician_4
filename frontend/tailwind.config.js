/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background:  'oklch(var(--background) / <alpha-value>)',
        foreground:  'oklch(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT:    'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT:    'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT:    'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT:    'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT:    'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT:    'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT:    'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        border:  'oklch(var(--border) / <alpha-value>)',
        input:   'oklch(var(--input) / <alpha-value>)',
        ring:    'oklch(var(--ring) / <alpha-value>)',
        success: 'oklch(var(--success) / <alpha-value>)',
        warning: 'oklch(var(--warning) / <alpha-value>)',
        cyan: {
          300: 'oklch(0.82 0.14 200)',
          400: 'oklch(0.75 0.16 200)',
          500: 'oklch(0.68 0.18 200)',
          600: 'oklch(0.60 0.18 200)',
        },
        violet: {
          400: 'oklch(0.68 0.20 280)',
          500: 'oklch(0.60 0.22 280)',
          600: 'oklch(0.52 0.22 280)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.5' }],
        sm:   ['0.875rem', { lineHeight: '1.6' }],
        base: ['1rem',     { lineHeight: '1.75' }],
        lg:   ['1.125rem', { lineHeight: '1.7' }],
        xl:   ['1.25rem',  { lineHeight: '1.6' }],
        '2xl':['1.5rem',   { lineHeight: '1.4' }],
        '3xl':['1.875rem', { lineHeight: '1.3' }],
        '4xl':['2.25rem',  { lineHeight: '1.2' }],
        '5xl':['3rem',     { lineHeight: '1.1' }],
        '6xl':['3.75rem',  { lineHeight: '1.05' }],
        '7xl':['4.5rem',   { lineHeight: '1.0' }],
      },
      borderRadius: {
        sm:   '0.25rem',
        DEFAULT: '0.5rem',
        md:   '0.5rem',
        lg:   '0.75rem',
        xl:   '1rem',
        '2xl':'1.5rem',
        '3xl':'2rem',
        full: '9999px',
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px oklch(0.68 0.18 200 / 0.4), 0 0 40px oklch(0.68 0.18 200 / 0.2)',
        'glow-violet': '0 0 20px oklch(0.60 0.22 280 / 0.4), 0 0 40px oklch(0.60 0.22 280 / 0.2)',
        'card-hover':  '0 8px 32px oklch(0.10 0.02 240 / 0.5)',
      },
      transitionTimingFunction: {
        'material': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'oklch(0.68 0.18 200 / 0.3)' },
          '50%':      { borderColor: 'oklch(0.68 0.18 200 / 0.8)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-in':     'fade-in 0.5s ease forwards',
        'border-glow': 'border-glow 2s ease-in-out infinite',
        shimmer:       'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
