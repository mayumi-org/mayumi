import { styled } from '@/theme/config'
import { animated } from '@react-spring/web'

export const StyledMenu = styled(animated.div, {
  text: '$sm',
  w: '$full',
  p: '$3',
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
  '& li.mayumi-menu-item': {
    transition: '$colors',
    '&:hover': {
      backgroundColor: '$primary',
    },
  },
  '& li.mayumi-menu-item__selected': {
    backgroundColor: '$unemphasizedSelectedTextBackgroundColor',
  },
  color: '$textColor',
  variants: {
    switch: {
      true: {
        overflow: 'hidden',
      },
    },
    light: {
      true: {
        '& li.mayumi-menu-item': {
          transition: '$colors',
          color: '$secondaryLabelColor',
          backgroundColor: 'transparent',
          '&:hover': {
            color: '$textColor',
          },
        },
        '& li.mayumi-menu-item__selected': {
          color: '$textColor',
        },
      },
    },
    ghost: {
      true: {
        '& li.mayumi-menu-item': {
          transition: '$colors',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '$windowBackgroundColor',
          },
        },
        '& li.mayumi-menu-item__selected': {
          backgroundColor: '$unemphasizedSelectedTextBackgroundColor',
        },
      },
    },
    size: {
      sm: {
        '& li.mayumi-menu-item': {
          my: '$0_5',
          rounded: '$default',
        },
      },
      md: {
        '& li.mayumi-menu-item': {
          rounded: '$default',
          py: '$1',
          my: '$0_5',
        },
      },
      lg: {
        '& li.mayumi-menu-item': {
          rounded: '$lg',
          py: '$2',
          px: '$4',
          my: '$0_5',
        },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
    light: false,
  },
})

export const StyledMenuItem = styled('li', {
  my: '$0',
  mx: '$0',
  px: '$2',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
})
