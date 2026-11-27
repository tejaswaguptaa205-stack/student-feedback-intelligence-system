/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          navy: '#244A73',
          navyHover: '#1B3756',
          navyLight: '#EBF1F6',
          charcoal: '#20242B',
          grey: '#697386',
          lightBg: '#F7F8FA',
          border: '#E5E7EB',
          subtle: '#F1F3F5',
        },
        feedback: {
          critical: '#B42318',
          criticalBg: '#FEF3F2',
          criticalBorder: '#FECDCA',
          high: '#C4320A',
          highBg: '#FFF6ED',
          highBorder: '#FED7AA',
          medium: '#B54708',
          mediumBg: '#FFFAEB',
          mediumBorder: '#FEDF89',
          low: '#344054',
          lowBg: '#F2F4F7',
          lowBorder: '#EAECF0',
          positive: '#067647',
          positiveBg: '#EDFDF5',
          positiveBorder: '#A6F4C5',
          neutral: '#475467',
          neutralBg: '#F8F9FC',
          neutralBorder: '#D0D5DD',
          negative: '#B42318',
          negativeBg: '#FEF3F2',
          negativeBorder: '#FECDCA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
