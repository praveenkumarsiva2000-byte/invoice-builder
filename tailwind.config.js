/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        baskerville: ['"Libre Baskerville"', 'Georgia', 'serif'],
        jetbrains: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: '#1A1F36',
        gold: '#C9A454',
        cream: '#F2EFE8',
        ivory: '#FAFAF7',
      },
    },
  },
  plugins: [],
};
