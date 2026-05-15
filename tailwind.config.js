/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { 
    extend: {
      colors: {
        blue: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#334e68', // Primary button color (Navy)
          700: '#243b53', // Hover state
          800: '#102a43',
          900: '#0a192f',
        }
      }
    } 
  },
  plugins: [],
}
