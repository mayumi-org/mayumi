// @ts-nocheck
// import { fileURLToPath } from 'url'
import path from 'path'
import plugin from 'tailwindcss/plugin'

const root = path.dirname(require.resolve('mayumi/package.json'))
export const patterns = `${root}/dist/**/*.{js,cjs,mjs}`

const makePrimaryColor =
  (l: number) =>
  ({ opacityValue }: { opacityValue?: number }) => {
    if (opacityValue === undefined) {
      return `hsl(204deg 100% ${l}%)`
    }
    return `hsl(204deg 100% ${l}% / ${opacityValue})`
  }

// as any, skip wrong type refs in pnpm
export const mayumi = plugin(
  () => {
    // props.config('content.files', ['./node_modules/mayumi/dist/**/*.{js,cjs,mjs}'])
    // console.log(props.config('content.files', ['./node_modules/mayumi/dist/**/*.{js,cjs,mjs}']))
  },
  {
    theme: {
      extend: {
        colors: {
          'mayumi-primary': {
            50: makePrimaryColor(97),
            100: makePrimaryColor(94),
            200: makePrimaryColor(86),
            300: makePrimaryColor(77),
            400: makePrimaryColor(66),
            500: makePrimaryColor(50),
            600: makePrimaryColor(45),
            700: makePrimaryColor(39),
            750: makePrimaryColor(35),
            800: makePrimaryColor(32),
            900: makePrimaryColor(24),
          },
          'mayumi-window-background-color': '#262626',
        },
      },
    },
  },
) as any
