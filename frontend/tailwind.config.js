/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neon fintech gradient theme
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a855f7',
          500: '#8b5cf6',
          600: '#4f46e5',
          700: '#3730a3',
          800: '#1e1b4b',
          900: '#020617',
          950: '#020617',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#083344',
        },
        button: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#020617',
        },
        background: {
          start: '#050816',
          end: '#0b1120',
        },
      },
      backgroundImage: {
        'gradient-fintech':
          'radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.18), transparent 55%), radial-gradient(circle at 100% 100%, rgba(129, 140, 248, 0.2), transparent 55%), linear-gradient(145deg, #050816 0%, #0b1120 100%)',
      },
      boxShadow: {
        'glass': '0 10px 30px rgba(0, 0, 0, 0.25)',
        'glass-lg': '0 20px 40px rgba(0, 0, 0, 0.35)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      borderRadius: {
        'card': '24px',
        'button': '16px',
        'input': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
}
