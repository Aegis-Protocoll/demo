import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mint: "#5FE3C0",
        "mint-dark": "#004440",
        "surface": "#1A1A1A",
        "surface-dark": "#101010",
        "border-subtle": "#242424",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
