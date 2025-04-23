/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        'screen-minus-header': 'calc(100vh - 64px)',
      },
      animation: {
        zoomIn: "zoomIn 0.3s ease-out",
      },
      keyframes: {
        zoomIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
    screens: {
      'xs': '320px', // Extra-small screens

      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',

    }
  },
  plugins: [],
});
