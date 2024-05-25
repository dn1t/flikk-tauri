import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
    },
    extend: {
      fontFamily: {
        display: [
          'Onest',
          '"Pretendard Variable"',
          ...defaultTheme.fontFamily.sans,
        ],
        sans: ['"Pretendard Variable"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('./src/radix-colors')],
};
