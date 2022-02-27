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

interface ReactiveDomReact {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
}

const defaultRect: ReactiveDomReact = {
  top: -1000,
  left: -1000,
  right: -1000,
  bottom: -1000,
  width: 0,
  height: 0,
}

export const getRect = (
  ref: React.RefObject<HTMLElement | null>,
  getPopupContainer?: () => HTMLElement,
): ReactiveDomReact => {
  if (!ref || !ref.current) return defaultRect
  const rect = ref.current.getBoundingClientRect()
  const container = getPopupContainer?.()?.getBoundingClientRect() || { top: 0, left: 0 }
  return {
    ...rect,
    width: rect.width || rect.right - rect.left,
    height: rect.height || rect.bottom - rect.top,

    // top: rect.top + document.documentElement.scrollTop,
    // bottom: rect.bottom + document.documentElement.scrollTop,
    // left: rect.left + document.documentElement.scrollLeft,
    // right: rect.right + document.documentElement.scrollLeft,
    top: rect.top + document.documentElement.scrollTop - container.top,
    bottom: rect.bottom + document.documentElement.scrollTop - container.top,
    left: rect.left + document.documentElement.scrollLeft - container.left,
    right: rect.right + document.documentElement.scrollLeft - container.left,
  }
}
