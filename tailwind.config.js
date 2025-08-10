/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Couleurs exactes de Cursor.com
        dark: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Couleurs de fond sombres (style Cursor)
        background: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Couleurs de surface (cards, modals, etc.) - style Cursor
        surface: {
          50: "#ffffff",
          100: "#fafafa",
          200: "#f5f5f5",
          300: "#e5e5e5",
          400: "#d4d4d4",
          500: "#a3a3a3",
          600: "#737373",
          700: "#525252",
          800: "#404040",
          900: "#262626",
          950: "#171717",
        },
        // Couleurs d'accent modernes (ancien bleu)
        accent: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Couleurs pour la lueur bleue (style Bolt.new)
        glow: {
          50: "rgba(14, 165, 233, 0.05)",
          100: "rgba(14, 165, 233, 0.08)",
          200: "rgba(14, 165, 233, 0.12)",
          300: "rgba(14, 165, 233, 0.16)",
          400: "rgba(14, 165, 233, 0.20)",
          500: "rgba(14, 165, 233, 0.25)",
        },
        // Couleurs de texte (style Cursor)
        text: {
          50: "#ffffff",
          100: "#fafafa",
          200: "#f5f5f5",
          300: "#e5e5e5",
          400: "#d4d4d4",
          500: "#a3a3a3",
          600: "#737373",
          700: "#525252",
          800: "#404040",
          900: "#262626",
          950: "#171717",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
        large:
          "0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 2px 10px -2px rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px rgba(14, 165, 233, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(14, 165, 233, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(14, 165, 233, 0.5)" },
        },
      },
    },
  },
  plugins: [],
};
