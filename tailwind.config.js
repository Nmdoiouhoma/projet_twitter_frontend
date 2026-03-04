/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        twitter: {
          blue: '#1DA1F2',
          dark: '#15202B',
          darker: '#0F1419',
        },
      },
      borderRadius: {
        xl: '1.25rem',
      },
    },
  },
  plugins: [],
};

