/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        column200: "495px",
        column300: "735px",
        column400: "975px",
      },
    },
  },
  plugins: [],
};
