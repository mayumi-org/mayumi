const plugin = require('tailwindcss/plugin')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    plugin(
      (props) => {
        // props.config('content.files', ['./node_modules/mayumi/dist/**/*.{js,cjs,mjs}'])
        console.log(props.config('content.files', ['./node_modules/mayumi/dist/**/*.{js,cjs,mjs}']))
      },
      (config) => {
        console.log(config)
        return config
        // { content: ['./node_modules/mayumi/dist/**/*.{js,cjs,mjs}'] }
      },
    ),
  ],
}
