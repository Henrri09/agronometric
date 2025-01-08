import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F7F7F7",
        foreground: "#18374C",
        primary: {
          DEFAULT: "#1EBCBF",
          foreground: "#FFFFFF",
          hover: "#19a5a8",
        },
        secondary: {
          DEFAULT: "#7AE09A",
          foreground: "#18374C",
          hover: "#5dc87d",
        },
        accent: {
          DEFAULT: "#18374C",
          foreground: "#FFFFFF",
          hover: "#234863",
        },
        destructive: {
          DEFAULT: "#FF4444",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#7AE09A",
          foreground: "#18374C",
        },
        warning: {
          DEFAULT: "#FFA726",
          foreground: "#18374C",
        },
        muted: {
          DEFAULT: "#F7F7F7",
          foreground: "#18374C",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;