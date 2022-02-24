import { styled } from '@/theme'

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
    leading: '$4',
    textIndent: '$1',
  },
  '& .mayumi-input-icon': {
    flexBox: 'center',
    w: '$4',
    h: '$4',
    mr: '$1',
    color: '$placeholderTextColor',
    '--ggs': 0.75,
    '& i': {
      color: '$placeholderTextColor',
    },
  },
  variants: {
    focus: {
      true: {
        borderColor: 'transparent',
        '& .mayumi-input-effect': {
          boxShadow: '$focus',
        },
      },
    },
  },
})
