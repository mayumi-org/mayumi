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
})

export const StyledTooltip = styled('div', {
  w: 'min-content',
  cursor: 'pointer',
  position: 'relative',
})
