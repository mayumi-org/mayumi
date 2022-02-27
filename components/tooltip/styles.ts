import { styled } from '@/theme'

import { Box } from '@/box'

export const StyledTooltipContent = styled(Box, {
  position: 'absolute',
  w: 'auto',
  overflow: 'visible',
  rounded: '$xl',
  px: '$2',
  py: '$1',
  zIndex: '$50',
  boxShadow: '$lg',
  '&:before': {
    right: '$0_5',
    top: '-$2_5',
    position: 'absolute',
    display: 'none',
    content: '',
    transform: 'translateX(50%)',
    borderBottomColor: '$windowBackgroundColor',
  },
  variants: {
    arrow: {
      true: {
        '&:before': {
          display: 'inline-block',
          // TODO:
          // ${triangle({
          //   pointingDirection: 'top',
          //   width: '20px',
          //   height: '10px',
          //   foregroundColor: 'white',
          // })};
        },
      },
    },
  },
})

export const StyledTooltip = styled('div', {
  w: 'min-content',
  cursor: 'pointer',
})
