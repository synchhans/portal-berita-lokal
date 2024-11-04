import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        expletus: ["var(--font-expletus-sans)", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      colors: {
        light: "var(--color-white)",
        dark: "var(--color-black)",
        primary: "var(--color-utama)",
        secondary: "var(--color-kedua)",
        border: "var(--color-border)",
        hint: "var(--color-hint)",
      },
    },
  },
  plugins: [],
};

export default config;
