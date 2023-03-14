const { mayumi, patterns } = require('mayumi/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  // TODO: looks like unable to modfiy content.files in plugin
  content: ['./src/**/*.{js,ts,jsx,tsx}', patterns],
  plugins: [mayumi],
}
