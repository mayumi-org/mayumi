import { styled } from '@/theme'

export const StyledDescription = styled('dl', {
  m: '$0',
  color: '$textColor',
  '& dt.mayumi-description-title': {
    fontWeight: '$bold',
    m: '$0',
    text: '$sm',
    position: 'relative',
  },
  '& dd.mayumi-description-content': {
    m: '$0',
    text: '$xs',
  },
  variants: {
    size: {
      sm: {
        '& dt.mayumi-description-title': {
          text: '$sm',
        },
        '& dd.mayumi-description-content': {
          text: '$xs',
        },
      },
      md: {
        '& dt.mayumi-description-title': {
          text: '$md',
        },
        '& dd.mayumi-description-content': {
          text: '$sm',
        },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
