import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#142f4c',
        secondary: '#3cb2e6',
        accent: '#EF8625',
        accentDark: '#B55D0C',
        grayLight: '#f1f1f1',
        grayText: '#3c3c3c',
      },
      fontFamily: {
        sans: ['DINPro', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
    },
  },
  plugins: [],
}

export default config
