import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Catches all files in the src directory
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom brand colors here if you want to expand later
        brand: {
          light: '#eff6ff',
          DEFAULT: '#2563eb', // Matches the blue-600 used in the components
          dark: '#1e40af',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
