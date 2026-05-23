import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:          "#f6e7a1",
        gold:           "#f1c40f",
        orange:         "#e67e22",
        "deep-orange":  "#d35400",

        "bg-primary":   "#faf6ee",
        "bg-secondary": "#fff8ea",
        "bg-tertiary":  "#f3ead6",
        "surface-dark": "#2c1810",

        "text-primary":   "#1a0f07",
        "text-secondary": "#5c4a3a",
        "text-tertiary":  "#8b7355",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body:    ['"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm:   "8px",
        md:   "12px",
        lg:   "16px",
        xl:   "24px",
        pill: "999px",
      },
      boxShadow: {
        "warm-sm":  "0 1px 3px rgba(44, 24, 16, 0.04)",
        "warm-md":  "0 4px 16px rgba(44, 24, 16, 0.06)",
        "warm-lg":  "0 8px 32px rgba(44, 24, 16, 0.08)",
        "warm-xl":  "0 16px 48px rgba(44, 24, 16, 0.12)",
        "gold-glow": "0 0 24px rgba(241, 196, 15, 0.25)",
        "glass":     "0 8px 32px rgba(44, 24, 16, 0.06)",
      },
      spacing: {
        "sidebar-collapsed": "72px",
        "sidebar-expanded":  "260px",
        "chat-panel": "380px",
      },
      animation: {
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "fade-in":    "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up":   "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":   "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 16px rgba(241, 196, 15, 0.15)" },
          "50%":      { boxShadow: "0 0 32px rgba(241, 196, 15, 0.35)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
