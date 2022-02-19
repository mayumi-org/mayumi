import { styled } from '@/theme'

export const StyledButton = styled('button', {
  cursor: 'pointer',
  border: 'none',
  textAlign: 'center',
  rounded: '$md',
  appearance: 'none',
  py: '$1',
  px: '$4',
  text: '$sm',
  fontFamily: '$default',
  color: '$white',
  backgroundColor: '$primary',
  boxShadow: '$sm',
  fontWeight: '$normal',
  '&:focus': {
    outline: 'none',
    border: 'none',
  },
})
