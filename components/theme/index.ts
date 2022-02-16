import { createStitches } from '@stitches/react'
import type * as Stitches from '@stitches/react';

const stitches = createStitches({
  prefix: 'mayumi',
  theme: {
    colors: {
      primary: '#017aff',
      danger: '#F96057',
      warning: '#F8CE52',
      success: '#5FCF65',
      default: '#E6E6E6',
      info: '#87aef3',
    },
  },
  utils: {
    p: (value: Stitches.PropertyValue<'padding'>) => ({
      padding: value,
    }),
  },
})

export const styled = stitches.styled
