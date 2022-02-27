import { styled } from '@/theme'
import { animated } from '@react-spring/web'

export const StyledBox = styled(animated.div, {
  rounded: '$md',
  overflow: 'hidden',
  backgroundColor: '$windowBackgroundColor',
  padding: '$0',
  flexBox: 'center',
  borderStyle: 'solid',
  borderColor: '$quaternaryLabelColor',
  borderWidth: '$px',
  color: '$textColor',
  px: '$2',
  py: '$2',
  variants: {
    transparent: {
      true: {
        backgroundColor: 'transparent',
      },
    },
    bordered: {
      true: {
        boxShadow: '$outline',
      },
    },
  },
  defaultVariants: {
    bordered: 'true',
  },
})
