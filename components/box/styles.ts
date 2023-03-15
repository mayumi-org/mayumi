import { styled } from '@/theme/config'
import { animated } from '@react-spring/web'
import { tv } from 'tailwind-variants'

export const box = tv({
  base: 'rounded-md overflow-hidden flex p-2 bg-mayumi-gray-400',
  variants: {
    bordered: {
      true: 'ring-1 ring-black',
      false: 'ring-0 ring-transparent',
    },
    transparent: {
      true: 'bg-transparent',
    },
  },
  defaultVariants: {
    bordered: true,
  },
})

export const StyledBox = styled(animated.div, {
  flexBox: 'center',
  color: '$textColor',
  borderStyle: 'solid',
  borderColor: '$quaternaryLabelColor',
  borderWidth: '$px',
})
