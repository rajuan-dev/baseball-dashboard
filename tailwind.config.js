/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#111f5a',
          orange: '#eb6a08',
          cream: '#fcf8ef',
          muted: '#f1ede6',
          line: '#e6e0d5',
          ink: '#182033',
          body: '#5f6372',
          success: '#7cd9a1',
          peach: '#ffd8c7',
          slate: '#edf1f6',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 4px 18px rgba(17, 31, 90, 0.08)',
        soft: '0 14px 30px rgba(17, 31, 90, 0.07)',
        cta: '0 12px 18px rgba(235, 106, 8, 0.22)',
      },
    },
  },
  plugins: [],
};
