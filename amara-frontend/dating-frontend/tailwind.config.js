/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1C1330',
          soft: '#4A3F5C',
          faint: '#8B7FA0',
        },
        cream: {
          DEFAULT: '#FBF5EC',
          dim: '#F3EBDD',
        },
        ember: {
          DEFAULT: '#E8536B',
          dark: '#C43F56',
          light: '#F3899C',
        },
        gold: {
          DEFAULT: '#D9A441',
          dark: '#B8842A',
          light: '#EFC876',
        },
        sage: '#4F7942',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 8px 30px -10px rgba(28, 19, 48, 0.25)',
        soft: '0 2px 12px rgba(28, 19, 48, 0.08)',
      },
    },
  },
  plugins: [],
}
