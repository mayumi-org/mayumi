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
  '& ul.mayumi-menu-submenu-content': {
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
  variants: {
    switch: {
      true: {
        overflow: 'hidden',
      },
    },
    size: {
      sm: {
        '& li.mayumi-menu-item': {
          my: '$0_5',
        },
      },
      md: {
        '& li.mayumi-menu-item': {
          py: '$1',
          my: '$0_5',
        },
      },
      lg: {
        '& li.mayumi-menu-item': {
          py: '$2',
          px: '$4',
          my: '$0_5',
        },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
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
    selected: {
      true: {
        backgroundColor: '$unemphasizedSelectedTextBackgroundColor',
      },
    },
  },
})
