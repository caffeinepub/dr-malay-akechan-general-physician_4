/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        heading: ['Roboto', 'sans-serif'],
        display: ['Roboto', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          secondary: 'var(--accent-secondary)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Teal accent
        teal: {
          400: 'oklch(0.75 0.15 185)',
          500: 'oklch(0.65 0.18 185)',
          600: 'oklch(0.55 0.18 185)',
        },
        // Cyan accent
        cyan: {
          300: 'oklch(0.82 0.14 195)',
          400: 'oklch(0.75 0.18 195)',
          500: 'oklch(0.65 0.18 195)',
          600: 'oklch(0.55 0.18 195)',
        },
        // Magenta accent
        magenta: {
          400: 'oklch(0.65 0.25 330)',
          500: 'oklch(0.55 0.25 330)',
        },
        // Emerald
        emerald: {
          400: 'oklch(0.75 0.18 155)',
          500: 'oklch(0.65 0.18 155)',
        },
        // Amber
        amber: {
          400: 'oklch(0.78 0.18 75)',
          500: 'oklch(0.68 0.18 75)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        aurora: {
          '0%, 100%': { transform: 'translateX(-20%) translateY(-10%) rotate(0deg) scale(1.2)' },
          '33%': { transform: 'translateX(10%) translateY(5%) rotate(120deg) scale(1.4)' },
          '66%': { transform: 'translateX(-5%) translateY(15%) rotate(240deg) scale(1.1)' },
        },
        'gradient-mesh': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        aurora: 'aurora 8s ease-in-out infinite',
        'gradient-mesh': 'gradient-mesh 6s ease infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
