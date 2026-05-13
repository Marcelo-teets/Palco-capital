import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#FBF6EC",
          100: "#F5E9C8",
          200: "#EDD48A",
          400: "#C9983A",
          600: "#9E7020",
          800: "#6B4A10",
        },
        navy: {
          50:  "#E8EDF5",
          100: "#C0CEDF",
          400: "#2D4B73",
          600: "#1A2E4A",
          800: "#0F1B35",
          900: "#080F1E",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans:  ["'DM Sans'", "system-ui", "sans-serif"],
        mono:  ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-up":    "fadeUp 0.7s ease forwards",
        "fade-in":    "fadeIn 0.6s ease forwards",
        "shimmer":    "shimmer 2s infinite",
        "float":      "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float:   { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-12px)" } },
      },
    },
  },
  plugins: [],
};

export default config;
