module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        shake: 'shake 0.5s ease-in-out',
      },
      boxShadow: {
        '2xl-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      backgroundColor: {
        'card-dark': '#1F2937',
      },
    },
  },
  plugins: [] // Removed line-clamp plugin as it's included by default in v3.3+
};