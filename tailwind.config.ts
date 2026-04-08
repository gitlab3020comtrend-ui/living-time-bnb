import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontSize: {
      xs: ['16px', { lineHeight: '1.5' }],
      sm: ['16px', { lineHeight: '1.6' }],
      base: ['18px', { lineHeight: '1.8' }],
      lg: ['20px', { lineHeight: '1.75' }],
      xl: ['24px', { lineHeight: '1.5' }],
      '2xl': ['28px', { lineHeight: '1.4' }],
      '3xl': ['34px', { lineHeight: '1.3' }],
      '4xl': ['42px', { lineHeight: '1.2' }],
      '5xl': ['54px', { lineHeight: '1.1' }],
      '7xl': ['82px', { lineHeight: '1' }],
    },
    extend: {
      colors: {
        primary: '#7A6B52',
        accent: '#D4A96A',
        dark: '#3D3526',
        cream: '#FBF8F2',
        sand: '#F0E8D8',
        warm: '#F5EDE0',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
