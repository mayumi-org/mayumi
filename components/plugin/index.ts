// @ts-nocheck
// import { fileURLToPath } from 'url'
import path from 'path'
import plugin from 'tailwindcss/plugin'
import { blue, gray } from '../theme/config'

const root = path.dirname(require.resolve('mayumi/package.json'))
export const patterns = `${root}/dist/**/*.{js,cjs,mjs}`

// as any, skip wrong type refs in pnpm
export const mayumi = plugin(
  (props) => {
    props.matchUtilities(
      {
        // TODO: glass style in plugin not same as theme/config, merge it later.
        // apply glass blur style into background, recommend gray-500/60 or gray-200/80
        'mayumi-glass': (value) => ({
          backdropFilter: `blur(${value})`,
        }),
      },
      { values: props.theme('space') },
    )
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
