const { colors } = require('./config.json');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
    },
    extend: {
      fontFamily: {
        jetbrains: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'text-dark-yellow',
    'text-dark-green',
    'text-dark-blue',
    'text-dark-red',
    'text-dark-purple',
    'text-dark-t4',
    'text-dark-datamines',
    'text-dark-chani',
  ],
};

