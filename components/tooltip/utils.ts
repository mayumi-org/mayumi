import { CSSProperties } from 'react'
import { Config } from 'react-popper-tooltip/dist/types'

export type Animation = 'scale' | 'opacity'

export const getAnimationConfig = (animation: Animation = 'scale') => {
  switch (animation) {
    case 'scale':
      return {
        from: { scale: 0, opacity: 0 },
        enter: { scale: 1, opacity: 1 },
        leave: { scale: 0, opacity: 0 },
      }
    case 'opacity':
      return {
        from: { opacity: 0, scale: 1 },
        enter: { opacity: 1, scale: 1 },
        leave: { opacity: 0, scale: 1 },
      }
    default:
      return {
        from: { scale: 0, opacity: 0 },
        enter: { scale: 1, opacity: 1 },
        leave: { scale: 0, opacity: 0 },
      }
  }
}

export const getAnimationStyles = (placement: Config['placement'] = 'bottom') => {
  const origins: Record<string, CSSProperties> = {
    left: {
      transformOrigin: 'right center',
    },
    'left-start': {
      transformOrigin: 'right top',
    },
    'left-end': {
      transformOrigin: 'right bottom',
    },
    top: {
      transformOrigin: 'bottom center',
    },
    'top-start': {
      transformOrigin: 'bottom left',
    },
    'top-end': {
      transformOrigin: 'bottom right',
    },
    bottom: {
      transformOrigin: 'top center',
    },
    'bottom-start': {
      transformOrigin: 'top left',
    },
    'bottom-end': {
      transformOrigin: 'top right',
    },
    right: {
      transformOrigin: 'center left',
    },
    'right-start': {
      transformOrigin: 'top left',
    },
    'right-end': {
      transformOrigin: 'bottom left',
    },
  }
  return origins[placement]
}
