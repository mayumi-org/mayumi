import { styled } from '@/theme'
import { animated } from '@react-spring/web'

export const StyledMenu = styled(animated.div, {
  text: '$sm',
  w: '$full',
  p: '$2',
  '& p.mayumi-menu-subtitle': {
    py: '$1',
    text: '$xs',
    fontWeight: '$bold',
    color: '$highlightColor',
  },
  // TODO: check color
  '& ul.mayumi-menu-submenu': {
    mb: '$2',
    listStyle: 'none',
    '&:last-child': {
      mb: '$0',
      p: '$0',
    },
    cursor: 'pointer',
  },
  '& div.mayumi-separator:last-child': {
    display: 'none',
  },
})

export const StyledMenuItem = styled('li', {
  rounded: '$default',
  my: '$0',
  mx: '$0',
  px: '$2',
  cursor: 'pointer',
  flexBox: '$center',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: '$primary',
    transition: '$colors',
  },
  variants: {
    size: {
      sm: {
        my: '$0_5',
      },
      md: {
        py: '$1',
        my: '$0_5',
      },
      lg: {
        py: '$2',
        px: '$4',
        my: '$0_5',
      },
    },
    selected: {
      true: {
        backgroundColor: '$unemphasizedSelectedTextBackgroundColor',
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
  // color: ${(props) => (props.type === 'action' ? 'var(--text-color-2)' : 'var(--text-color-0)')};
})
