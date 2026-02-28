/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // High-tech palette
        navy: {
          950: "#050814",
          900: "#080d1e",
          800: "#0a0e27",
          700: "#0f1729",
          600: "#151b2e",
          500: "#1a2235",
          400: "#1e2a40",
          300: "#243050",
        },
        cyan: {
          DEFAULT: "var(--cyan)",
          50: "oklch(0.97 0.03 200)",
          100: "oklch(0.93 0.06 200)",
          200: "oklch(0.87 0.1 200)",
          300: "oklch(0.82 0.14 200)",
          400: "oklch(0.78 0.16 200)",
          500: "oklch(0.75 0.18 200)",
          600: "oklch(0.68 0.18 200)",
          700: "oklch(0.6 0.16 200)",
          800: "oklch(0.5 0.14 200)",
          900: "oklch(0.4 0.1 200)",
        },
        techmagenta: {
          DEFAULT: "oklch(0.7 0.22 330)",
          500: "oklch(0.7 0.22 330)",
          400: "oklch(0.75 0.2 330)",
          600: "oklch(0.62 0.22 330)",
        },
        techemerald: {
          DEFAULT: "oklch(0.7 0.18 155)",
          500: "oklch(0.7 0.18 155)",
          400: "oklch(0.75 0.16 155)",
          600: "oklch(0.62 0.18 155)",
        },
        techamber: {
          DEFAULT: "oklch(0.78 0.18 75)",
          500: "oklch(0.78 0.18 75)",
          400: "oklch(0.82 0.16 75)",
          600: "oklch(0.7 0.18 75)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0px",
        sharp: "2px",
        card: "8px",
        pill: "9999px",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px oklch(0.75 0.18 200 / 0.4), 0 0 40px oklch(0.75 0.18 200 / 0.15)",
        "glow-cyan-sm": "0 0 10px oklch(0.75 0.18 200 / 0.3), 0 0 20px oklch(0.75 0.18 200 / 0.1)",
        "glow-magenta": "0 0 20px oklch(0.7 0.22 330 / 0.4), 0 0 40px oklch(0.7 0.22 330 / 0.15)",
        "glow-emerald": "0 0 20px oklch(0.7 0.18 155 / 0.4), 0 0 40px oklch(0.7 0.18 155 / 0.15)",
        "glow-amber": "0 0 20px oklch(0.78 0.18 75 / 0.4), 0 0 40px oklch(0.78 0.18 75 / 0.15)",
        "card-dark": "0 4px 24px oklch(0 0 0 / 0.4), 0 1px 4px oklch(0 0 0 / 0.2)",
        "card-hover": "0 8px 40px oklch(0 0 0 / 0.5), 0 0 20px oklch(0.75 0.18 200 / 0.15)",
      },
      animation: {
        "border-glow": "border-glow-pulse 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "aurora": "aurora 20s linear infinite",
        "grid-move": "grid-move 4s linear infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        "border-glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px oklch(0.75 0.18 200 / 0.3)" },
          "50%": { boxShadow: "0 0 25px oklch(0.75 0.18 200 / 0.6), 0 0 50px oklch(0.75 0.18 200 / 0.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        aurora: {
          "0%": { transform: "rotate(0deg) scale(1)", opacity: "0.3" },
          "33%": { transform: "rotate(120deg) scale(1.1)", opacity: "0.5" },
          "66%": { transform: "rotate(240deg) scale(0.9)", opacity: "0.3" },
          "100%": { transform: "rotate(360deg) scale(1)", opacity: "0.3" },
        },
        "grid-move": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(40px)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(oklch(0.75 0.18 200 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.18 200 / 0.05) 1px, transparent 1px)",
        "hero-gradient": "linear-gradient(135deg, oklch(0.08 0.025 255) 0%, oklch(0.12 0.04 255) 50%, oklch(0.08 0.025 255) 100%)",
        "card-gradient": "linear-gradient(135deg, oklch(0.13 0.03 255) 0%, oklch(0.16 0.035 255) 100%)",
        "cyan-gradient": "linear-gradient(135deg, oklch(0.85 0.15 200), oklch(0.75 0.18 200), oklch(0.65 0.2 220))",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
