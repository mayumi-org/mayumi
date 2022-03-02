import { styled } from '@/theme/config'

export const StyledAvatar = styled('span', {
  display: 'inline-block',
  rounded: '$full',
  '& img.mayumi-avatar-image': {
    w: '100%',
    h: '100%',
    rounded: '$full',
    objectFit: 'cover',
  },
  backgroundColor: '$primary',
})
