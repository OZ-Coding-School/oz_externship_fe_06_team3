import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
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
        kakao: {
          text: '#391C1A', // 카카오 버튼 텍스트 색상
        },
        'placeholder-a': {
          DEFAULT: '#9D9D9D', // 연한 회색 (플레이스홀더용)
        },
      },
    },
  },
  plugins: [],
}

export default config
