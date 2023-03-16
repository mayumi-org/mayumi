// @ts-nocheck
// import { fileURLToPath } from 'url'
import path from 'path'
import plugin from 'tailwindcss/plugin'
import { blue, gray } from '../theme/config'

const root = path.dirname(require.resolve('mayumi/package.json'))
export const patterns = `${root}/dist/**/*.{js,cjs,mjs}`

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
          'mayumi-blue': {
            ...blue,
          },
          'mayumi-gray': {
            ...gray,
          },
          'mayumi-primary': ({ opacityValue }: { opacityValue?: number }) =>
            `hsla(217.15,100%,53%, ${opacityValue})`,
        },
      },
    },
  },
) as any