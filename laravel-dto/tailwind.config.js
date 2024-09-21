/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/views/app.blade.php', './resources/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E62437',
        cBlack: '#191919',
        danger: '#E62437',
        mask: 'rgb(107, 114, 128, 0.5)',
      },
      zIndex: {
        100: 100,
        200: 200,
      },
    },
  },
  plugins: [],
};
