import { styled } from '@/theme'

export const StyledButton = styled('button', {
  cursor: 'pointer',
  border: 'none',
  textAlign: 'center',
  appearance: 'none',
  fontFamily: '$default',
  boxShadow: '$default',
  fontWeight: '$normal',
  '&:focus': {
    outline: 'none',
    border: 'none',
  },
  variants: {
    color: {
      primary: {
        backgroundColor: '$primary',
        color: '$textColor',
        '&:active': {
          backgroundColor: '$keyboardFocusIndicatorColor',
        },
      },
      gray: {
        backgroundColor: '$tertiaryLabelColor',
        color: '$textColor',
        '&:active': {
          backgroundColor: '$secondaryLabelColor',
        },
      },
    },
    size: {
      md: {
        py: '$1',
        px: '$4',
        text: '$sm',
        rounded: '$md',
      },
      sm: {
        py: '$0.5',
        px: '$2',
        text: '$xs',
        rounded: '$md',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
})
