import { styled } from '@/theme/config'
import { animated } from '@react-spring/web'

export const StyledBox = styled(animated.div, {
  rounded: '$md',
  overflow: 'hidden',
  backgroundColor: '$windowBackgroundColor',
  flexBox: 'center',
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
        borderStyle: 'solid',
        borderColor: '$quaternaryLabelColor',
        borderWidth: '$px',
      },
    },
  },
  defaultVariants: {
    bordered: 'true',
  },
})
