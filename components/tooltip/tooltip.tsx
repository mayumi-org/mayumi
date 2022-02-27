import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { config, Transition } from '@react-spring/web'
import cx from 'clsx'

import { getRect, getAnimationConfig } from './utils'
import { useOnClickOutside } from '../hooks/use-click-outside'
import { useTooltip } from './tooltip-context'
import { StyledTooltip, StyledTooltipContent } from './styles'
import { getTooltipPosition, TooltipPosition, Placement } from './utils/get-position'

export type TooltipContentProps = {
  children?: React.ReactNode
  parent: React.RefObject<HTMLDivElement>
  visible?: boolean
  placement?: Placement
  offset?: number[]
  getPopupContainer?: () => HTMLElement
}

export const defaultTooltipPosition = {
  top: '-1000px',
  left: '-1000px',
  transform: 'none',
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ placement = 'bottom', offset = [4, 4], ...props }, ref) => {
    const [rect, setRect] = useState<TooltipPosition>(defaultTooltipPosition)
    const { showArrow, animation } = useTooltip()
    // spring animation config
    const animationConfig = getAnimationConfig(animation)
    // update tooltip content position
    const updateRect = () => {
      const position = getTooltipPosition({
        placement,
        rect: getRect(props.parent, props.getPopupContainer),
        offset,
        showArrow,
      })
      setRect(position)
    }
    useEffect(() => {
      updateRect()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.visible])
    if (typeof window === 'undefined') {
      return null
    }
    return createPortal(
      <Transition
        items={props.visible}
        from={{ ...animationConfig?.from }}
        enter={{ ...animationConfig?.enter }}
        leave={{ ...animationConfig?.leave }}
        config={config.stiff}
        delay={200}
      >
        {(styles, item) =>
          item && (
            <StyledTooltipContent
              className="mayumi-tooltip-content"
              style={{
                ...styles,
                top: rect.top,
                left: rect.left,
                transform: rect.transform,
                transformOrigin: rect.transformOrigin,
              }}
              ref={ref}
            >
              {props.children}
            </StyledTooltipContent>
          )
        }
      </Transition>,
      props.getPopupContainer?.() || document.body,
    )
  },
)

TooltipContent.displayName = 'TooltipContent'

export type ToolTipProps = Pick<React.HTMLAttributes<HTMLDivElement>, 'id'> & {
  /**
   * Tooltip trigger
   */
  children?: React.ReactNode
  /**
   * Tooltip popover content
   */
  content?: React.ReactNode
  placement?: Placement
  offset?: TooltipContentProps['offset']
  trigger?: 'hover' | 'click'
  defaultVisible?: boolean
  visible?: boolean
  className?: string
  style?: React.CSSProperties
  outsideCloseable?: boolean
  onClickOutside?: () => void
  onClick?: () => void
  onMouseEnter?: () => void
  getPopupContainer?: () => HTMLElement
}

export const Tooltip = ({
  trigger = 'hover',
  defaultVisible = false,
  placement = 'bottom',
  ...props
}: ToolTipProps) => {
  const parent = useRef<HTMLDivElement>(null)
  const child = useRef<HTMLDivElement>(null)
  const hasControlled = 'visible' in props
  const { outsideCloseable } = useTooltip()
  const [visible, setVisible] = useState(defaultVisible)
  const controlledVisible = useMemo(() => {
    return hasControlled ? props.visible : visible
  }, [visible, props.visible, hasControlled])
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setVisible(true)
      props.onMouseEnter?.()
    }
  }
  const handleClick = () => {
    if (trigger === 'click') {
      setVisible(true)
      props.onClick?.()
    }
  }
  useOnClickOutside(
    child,
    () => {
      props.onClickOutside?.()
      setVisible(false)
    },
    { disable: !outsideCloseable, includes: [] },
  )
  return (
    <StyledTooltip
      className={cx('mayumi-tooltip', props.className)}
      ref={parent}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      style={props.style}
      id={props.id}
    >
      {props.children}
      <TooltipContent
        visible={controlledVisible}
        placement={placement}
        parent={parent}
        ref={child}
        offset={props.offset}
        getPopupContainer={props.getPopupContainer}
      >
        {props.content}
      </TooltipContent>
    </StyledTooltip>
  )
}
