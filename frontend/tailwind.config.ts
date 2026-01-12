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
        // Couleurs du logo License Sale
        'brand-red': '#E63946',
        'brand-blue': '#1D70B8',
        'brand-blue-light': '#3B9DE8',
      },
    },
  },
  plugins: [],
};
export default config;
