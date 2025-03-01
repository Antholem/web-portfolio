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
        brand: "#0073e6",
        dark: {
          DEFAULT: "#121212",
          paper: "#1A1A1A",
          divider: "#1F1F1F",
          text: {
            primary: "#ffffff",
            secondary: "#B3B3B3",
            disabled: "#808080",
          },
          action: {
            active: "#ffffff",
            hover: "#141414",
            selected: "#292929",
            disabled: "#4D4D4D",
            disabledBackground: "#1F1F1F",
          },
        },
        light: {
          DEFAULT: "#f5f5f5",
          paper: "#ffffff",
          divider: "#E0E0E0",
          text: {
            primary: "#000000",
            secondary: "#757575",
            disabled: "#BDBDBD",
          },
          action: {
            active: "#000000",
            hover: "#F5F5F5",
            selected: "#E8E8E8",
            disabled: "#E0E0E0",
            disabledBackground: "#F5F5F5",
          },
        },
      },
    },
  },
  plugins: [],
};
