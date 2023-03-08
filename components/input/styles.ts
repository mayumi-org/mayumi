import { styled } from '@/theme/config'

export const StyledInput = styled('div', {
  position: 'relative',
  w: '$full',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'start',
  overflow: 'visible',
  rounded: '$md',
  p: '$2',
  color: '$textColor',
  text: '$sm',
  border: '1px solid $quaternaryLabelColor',
  backgroundColor: '$windowBackgroundColor',
  '& .mayumi-input-effect': {
    position: 'absolute',
    top: 0,
    left: 0,
    w: '$full',
    h: '$full',
    rounded: '$md',
    pointerEvents: 'none',
    transformOrigin: 'center',
  },
  '& input': {
    appearance: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    w: '$full',
    boxSizing: 'border-box',
    textIndent: '$1',
  },
  '& .mayumi-input-icon': {
    flexBox: 'center',
    mr: '$1',
    color: '$placeholderTextColor',
    '--ggs': 0.75,
    '& i': {
      color: '$placeholderTextColor',
    },
  },
  variants: {
    size: {
      sm: {
        '& .mayumi-input-icon': {
          w: '$3',
          h: '$3',
        },
        '& input': {
          leading: '$3',
          h: '$3',
        },
      },
      md: {
        '& .mayumi-input-icon': {
          w: '$4',
          h: '$4',
        },
        '& input': {
          leading: '$4',
          h: '$4',
        },
      },
    },
    focus: {
      true: {
        borderColor: 'transparent',
        '& .mayumi-input-effect': {
          boxShadow: '$focus',
        },
      },
    },
    ghost: {
      true: {
        border: 'none',
        backgroundColor: 'transparent',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
