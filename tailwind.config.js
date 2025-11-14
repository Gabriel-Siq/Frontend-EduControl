/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        160: "40rem",
      },
      colors: {
        goldcustom: 'rgb(197, 160, 47)',
      },
    },
  },
  plugins: [],
}