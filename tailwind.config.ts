import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hlb-primary': 'var(--hlb-primary)',
        'hlb-gold': 'var(--hlb-gold)',
        'hlb-bg': 'var(--hlb-bg)',
        'hlb-text': 'var(--hlb-text)',
        'hlb-text-light': 'var(--hlb-text-light)',
        'hlb-available': 'var(--hlb-available)',
        'hlb-order-tomorrow': 'var(--hlb-order-tomorrow)',
        'hlb-card-bg': 'var(--hlb-card-bg)',
        'hlb-shadow': 'var(--hlb-shadow)',
      },
      fontFamily: {
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
        'amiri': ['var(--font-amiri)', 'serif'],
        'sans': ['var(--font-montserrat)', 'sans-serif'],
        'serif': ['var(--font-montserrat)', 'sans-serif'],
      },
      boxShadow: {
        'hlb': '0 4px 6px -1px var(--hlb-shadow), 0 2px 4px -1px var(--hlb-shadow)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;
