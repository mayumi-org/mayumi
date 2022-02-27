interface ParentDomRect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

export type Placement = 'left' | 'right' | 'bottom' | 'top'

export type TooltipPosition = {
  top: string
  left: string
  transform?: string
  transformOrigin?: string
}

type UsePositionProps = {
  placement: Placement
  rect: ParentDomRect
  offset: number[]
  showArrow?: boolean
}

const getPosition = ({ placement, rect, offset }: UsePositionProps): TooltipPosition => {
  const [x = 0, y = 0] = offset
  const positions: { [key in Placement]: TooltipPosition } = {
    top: {
      top: `${rect.top - y}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: 'translate(-50%, -100%)',
      transformOrigin: 'top left',
    },
    bottom: {
      top: `${rect.bottom + y}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: 'translate(-50%, 0)',
      transformOrigin: 'top left',
    },
    left: {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.left - x}px`,
      transform: 'translate(-100%, -50%)',
      transformOrigin: 'top left',
    },
    right: {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.right + x}px`,
      transform: 'translate(0, -50%)',
      transformOrigin: 'top left',
    },
  }
  return positions[placement] || (positions.top as TooltipPosition)
}

export const getTooltipPosition = ({ offset = [0, 0], ...props }: UsePositionProps) => {
  const offsetWithArrow = props.showArrow ? [offset[0] + 8, offset[1] + 0] : offset ?? [0, 0]
  return getPosition({ ...props, offset: offsetWithArrow })
}
