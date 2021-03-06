import { styled } from '@/theme/config'

export const StyledDot = styled('span', {
  display: 'inline-block',
  width: '$2',
  height: '$2',
  rounded: '$full',
  verticalAlign: 'middle',
  variants: {
    type: {
      success: {
        backgroundColor: '$green',
      },
      danger: {
        backgroundColor: '$red',
      },
      warning: {
        backgroundColor: '$yellow',
      },
      info: {
        backgroundColor: '$primary',
      },
    },
  },
  defaultVariants: {
    type: 'info',
  },
})
