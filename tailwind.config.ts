import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: "rgb(var(--sky) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        moon: "#E8B04B",
        "moon-deep": "#C99A3D",
        night: "#171935",
      },
      fontFamily: {
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-lora)", "serif"],
        ui: ["var(--font-quicksand)", "sans-serif"],
      },
      maxWidth: {
        page: "1100px",
      },
    },
  },
  plugins: [],
};
export default config;
