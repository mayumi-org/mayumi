import { styled } from '@/theme/config'
import { tv } from 'tailwind-variants'

export const text = tv({
  base: 'text-base text-mayumi-gray-1200',
  variants: {
    as: {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-bold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-semibold',
      h6: 'text-base font-semibold',
      p: 'text-base',
    },
  },
  defaultVariants: {
    as: 'p',
  },
})

export const StyledText = styled('p', {
  variants: {
    type: {
      secondary: {
        color: '$labelColor',
      },
      tertiary: {
        color: '$secondaryLabelColor',
      },
      quaternary: {
        color: '$tertiaryLabelColor',
      },
      default: {},
    },
  },
})
