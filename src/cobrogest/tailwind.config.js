/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // debe incluir tus archivos React
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-20px) translateX(15px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(20px) translateX(-15px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        floatReverse: 'floatReverse 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
