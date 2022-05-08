import { externals } from 'rollup-plugin-node-externals'
import multiInput from 'rollup-plugin-multi-input'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias'
import size from 'rollup-plugin-size'
import sourcemaps from 'rollup-plugin-sourcemaps'
import ce from 'rollup-plugin-condition-exports'
import { defineConfig } from 'rollup'
import path from 'path'

export default defineConfig([
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: ['components/**/*.(ts|tsx)'],
    plugins: [
      multiInput({
        relative: 'components/',
      }),
      externals({
        devDeps: false,
      }),
      typescript({
        check: false,
        tsconfigOverride: {
          exclude: ['example', 'apps/docs'],
        },
      }),
      alias({
        entries: [
          {
            find: '@',
            replacement: path.resolve(__dirname, './components'),
          },
        ],
      }),
      ce({
        glob: ['components/**/index.ts'],
        base: 'components/',
        dirs: 'dist',
      }),
      sourcemaps(),
      commonjs(), // so Rollup can convert `ms` to an ES module
      size(),
    ],
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].cjs',
        chunkFileNames: '[name]/[name].cjs',
        sourcemap: true,
      },
      {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name]/[name].mjs',
        sourcemap: true,
      },
    ],
  },
])
