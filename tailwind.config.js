/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'event-color': 'var(--even-color)',
        'odd-color': 'var(--odd-color)',
        'active-cell': '#e5e53b',
      },
      width: {
        'cell-size': 'var(--cell-size)',
        'board-size': 'calc(var(--cell-size) * 8)',
      },
      height: {
        'cell-size': 'var(--cell-size)',
      },
    },
  },
  plugins: [],
};
