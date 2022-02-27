import { CSSProperties } from 'react'

export type Animation = 'scale' | 'opacity'
export type Placement = 'left' | 'top' | 'right' | 'bottom'

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

export const getAnimationStyles = (placement: Placement = 'bottom') => {
  const origins: Record<string, CSSProperties> = {
    left: {
      transformOrigin: 'right center',
    },
    top: {
      transformOrigin: 'bottom center',
    },
    bottom: {
      transformOrigin: 'top center',
    },
    right: {
      transformOrigin: 'top center',
    },
  }
  return origins[placement]
}
