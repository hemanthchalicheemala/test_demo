/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Refined indigo–violet brand
        brand: {
          50: '#f3f2ff',
          100: '#e9e7ff',
          200: '#d5d1ff',
          300: '#b7adff',
          400: '#9480fc',
          500: '#7857f6',
          600: '#6538ea',
          700: '#5827cf',
          800: '#4922a7',
          900: '#3d2086',
          950: '#25124f',
        },
        // Warm gold accent
        accent: {
          50: '#fff8eb',
          100: '#fdf0d5',
          200: '#fbdfa8',
          300: '#f8c86f',
          400: '#f5ad3c',
          500: '#f2911a',
          600: '#d6720f',
          700: '#b25510',
          800: '#914314',
          900: '#773814',
        },
        // Warmed neutral (ink) scale
        ink: {
          50: '#f7f7fb',
          100: '#eeeef4',
          200: '#dcdce7',
          300: '#c0c1d2',
          400: '#9c9db6',
          500: '#7c7d9a',
          600: '#63647e',
          700: '#4f5066',
          800: '#3a3b4d',
          900: '#26273a',
          950: '#181927',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(24,25,39,0.04), 0 4px 16px -6px rgba(24,25,39,0.08)',
        soft: '0 8px 40px -12px rgba(24,25,39,0.16)',
        glow: '0 10px 30px -8px rgba(101,56,234,0.45)',
        'glow-accent': '0 10px 30px -8px rgba(242,145,26,0.45)',
        inner: 'inset 0 1px 0 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6538ea 0%, #7857f6 45%, #9480fc 100%)',
        'brand-radial': 'radial-gradient(1200px 500px at 100% -10%, rgba(120,87,246,0.25), transparent 60%)',
        'mesh': 'radial-gradient(at 0% 0%, rgba(120,87,246,0.14) 0px, transparent 50%), radial-gradient(at 98% 10%, rgba(242,145,26,0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(101,56,234,0.10) 0px, transparent 50%)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
