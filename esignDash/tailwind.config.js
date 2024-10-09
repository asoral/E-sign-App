/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textStroke: {
        DEFAULT: '2px black',
      },
      height: {
        '9/10': '90vh',
      },
    },
  },
  plugins: [
    
    function({ addUtilities }) {
      
      addUtilities({
        '.text-stroke': {
          '-webkit-text-stroke': '2px #283C42',
          'text-stroke': '2px #283C42',
        },
        '.text-stroke-sm': {
          '-webkit-text-stroke': '1px #283C42',
          'text-stroke': '1px #283C42',
        }
      });
    },
  ],
}