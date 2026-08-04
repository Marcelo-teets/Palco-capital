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
          200: "#D8C08A",
          400: "#B08A43",
        },
        navy: {
          400: "#8A97A5",
          600: "#12314C",
          800: "#0B1F33",
          900: "#061726",
        },
      },
      fontFamily: {
        serif: ["var(--font-bodoni)", "Georgia", "serif"],
        sans: ["var(--font-archivo)", "Arial", "sans-serif"],
        mono: ["var(--font-plex-mono)", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
