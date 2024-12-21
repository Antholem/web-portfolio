/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "4xl": "1920px",
    },
    extend: {
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
        heading: ["Open Sans", "sans-serif"],
      },
      colors: {
        brand: "#ff014f",
        dark: "#1a1a1a",
        light: "#f5f5f5",
      },
    },
  },
  plugins: [],
};
