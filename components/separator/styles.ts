import { styled } from '@/theme'

export const StyledSeparator = styled('div', {
  backgroundColor: '$separatorColor',
  variants: {
    type: {
      vertical: {
        w: '$px',
        h: '$6',
        mx: '$3',
        my: '$0',
      },
      horizontal: {
        w: '100%',
        h: '$px',
        mx: '$0',
        my: '$3',
      },
    },
  },
  defaultVariants: {
    type: 'horizontal',
  },
})
