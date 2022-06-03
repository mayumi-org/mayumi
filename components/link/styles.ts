import { styled } from '@/theme/config'

export const StyledLink = styled('a', {
  color: '$linkColor',
  display: 'inline-flex',
  alignItems: 'baseline',
  lineHeight: 'inherit',
  textDecoration: 'none',
  width: 'fitContent',
  cursor: 'pointer',
  transition: '$all',
  variants: {
    animation: {
      light: {
        '&:hover': {
          opacity: 0.8,
        },
        transition: '$all',
      },
      reverse: {
        '&:hover': {
          color: '$white',
        },
        transition: '$colors',
      },
    },
  },
  defaultVariants: {
    animation: 'light',
  },
})
