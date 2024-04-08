/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  ...defaultTheme,
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        mini: "0.625rem",
      },
      screens: {
        column200: "495px",
        column300: "735px",
        column400: "975px",
      },
    },
  },
  plugins: [],
};
