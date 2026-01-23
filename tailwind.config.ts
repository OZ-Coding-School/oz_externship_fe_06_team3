import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6201E0',
          hover: '#4E01B3',
          active: '#380186',
          100: '#EFE6FC',
          400: '#721AE3',
        },
        mono: {
          200: '#ECECEC',
          250: '#CECECE',
          400: '#BDBDBD',
          600: '#9D9D9D',
        },
      },
    },
  },
  plugins: [],
}

export default config
