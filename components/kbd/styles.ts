import { styled } from '@/theme/config'

export const StyledKbd = styled('kbd', {
  px: '$2',
  backgroundColor: '$windowBackgroundColor',
  color: '$textColor',
  borderBottom: '1px solid $gridColor',
  boxShadow: '$default',
  rounded: '$sm',
  cursor: 'pointer',
  fontWeight: 'bolder',
  text: '$sm',
  fontFamily: '$mono',
})
