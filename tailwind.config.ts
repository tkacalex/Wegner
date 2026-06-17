import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Markenfarben aus dem Logo
        brand: {
          red: "#E11122",
          "red-dark": "#B00C19",
          black: "#0B0B0C",
          ink: "#16171A",
          gray: "#2A2C31",
          mute: "#6B7280",
          line: "#E6E7EA",
          surface: "#F5F6F8",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "Segoe UI", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,17,26,0.04), 0 8px 30px rgba(16,17,26,0.06)",
        "card-lg": "0 2px 8px rgba(16,17,26,0.06), 0 20px 50px rgba(16,17,26,0.10)",
      },
      maxWidth: {
        prose: "65ch",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.6s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
