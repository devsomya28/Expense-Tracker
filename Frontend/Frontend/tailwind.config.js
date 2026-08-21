/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#09090b",
          panel: "#0f0f13",
          card: "#141419",
          border: "#232329",
          hover: "#1b1b21",
        },
        brand: {
          DEFAULT: "#7c3aed",
          light: "#a78bfa",
          dark: "#5b21b6",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(124,58,237,0.35)",
      },
    },
  },
  plugins: [],
};
