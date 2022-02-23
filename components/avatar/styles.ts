import { styled } from '@/theme'

export const StyledAvatar = styled('span', {
  display: 'inline-block',
  rounded: '$full',
  '& img.mayumi-avatar-image': {
    w: '100%',
    h: '100%',
    rounded: '$full',
    objectFit: 'cover',
  },
})
