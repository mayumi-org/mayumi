import React from 'react'

import { styled } from '@/theme/config'
import { Icon, IconProps } from './icon'

export const CloseIcon = styled(Icon, {
  '--ggs': 0.5,
  boxSizing: 'border-box',
  position: 'relative',
  display: 'block',
  transform: 'scale(var(--ggs,1))',
  width: '$5_5',
  height: '$5_5',
  border: '2px solid transparent',
  rounded: '$md',
  '&::after, &::before': {
    content: '',
    display: 'block',
    boxSizing: 'border-box',
    position: 'absolute',
    width: '$4',
    height: '$0_5',
    background: 'currentColor',
    transform: 'rotate(45deg)',
    rounded: '5px',
    top: '$2',
    left: '$px',
  },
  '&::after': {
    transform: 'rotate(-45deg)',
  },
})

const StyledClose = styled('span', {
  cursor: 'pointer',
  rounded: '$full',
  pointerEvents: 'all',
  variants: {
    light: {
      false: {
        backgroundColor: '$underPageBackgroundColor',
      },
      true: {
        backgroundColor: 'transparent',
      },
    },
  },
  defaultVariants: {
    light: true,
  },
})

export const Close = (props: IconProps & { light?: boolean }) => {
  return (
    <StyledClose {...props} light={props.light}>
      <CloseIcon />
    </StyledClose>
  )
}
