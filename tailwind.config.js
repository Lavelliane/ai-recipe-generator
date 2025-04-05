// tailwind.config.js
const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A8E6A1', // Primary pastel green
          light: '#D4F5D2',   // Lighter shade of primary
          dark: '#6FBF73',    // Darker shade of primary
        },
        secondary: {
          DEFAULT: '#FFF3B0', // Secondary pastel yellow
          light: '#FFF9D9',   // Lighter shade of secondary
          dark: '#FFD700',    // Darker shade of secondary
        },
        accent: {
          DEFAULT: '#FFCCBC', // Accent pastel peach
          light: '#FFE0E0',   // Lighter shade of accent
          dark: '#FF8A65',    // Darker shade of accent
        },
        background: '#FFFFFF', // White background
        text: {
          DEFAULT: '#4A4A4A', // Dark gray text
          light: '#6F6F6F',   // Lighter gray text
          dark: '#2A2A2A',    // Darker gray text
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};