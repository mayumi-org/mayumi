import { styled } from '@/theme/config'

export const StyledLink = styled('a', {
  color: '$linkColor',
  display: 'inline-flex',
  alignItems: 'baseline',
  lineHeight: 'inherit',
  textDecoration: 'none',
  width: 'fitContent',
  '&:hover': {
    opacity: 0.8,
  },
  transition: '$all',
})
