const { mayumi, patterns } = require('mayumi/plugin')
const { blackA, mauve, violet, grayDark } = require('@radix-ui/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  // TODO: looks like unable to modfiy content.files in plugin
  content: ['./src/**/*.{js,ts,jsx,tsx}', patterns],
  plugins: [mayumi],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...mauve,
        ...violet,
        ...grayDark,
      },
    },
  },
}
