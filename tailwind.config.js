/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aperitivo: {
          linen: '#FAF7F2',
          card: '#FFFFFF',
          border: '#E8E2D8',
          slate: '#1E1B18',
          muted: '#6E675F',
          spritz: '#E64A19',
          campari: '#900C3F',
          vermilion: '#D84315',
          gold: '#C59B27',
          olive: '#4A5538',
          softGlow: '#FFF6EF',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'paper': '0 2px 8px -1px rgba(30, 27, 24, 0.06), 0 1px 3px -1px rgba(30, 27, 24, 0.04)',
        'paper-lg': '0 12px 32px -4px rgba(30, 27, 24, 0.12), 0 4px 12px -2px rgba(30, 27, 24, 0.06)',
      },
    },
  },
  plugins: [],
}
