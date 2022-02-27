import React, { useRef } from 'react'
import { config, Transition } from '@react-spring/web'
import cx from 'clsx'
import { usePopperTooltip } from 'react-popper-tooltip'

import { getAnimationConfig, Animation, getAnimationStyles, Placement } from './utils'
import { StyledTooltip, StyledTooltipContent } from './styles'
import { Config } from 'react-popper-tooltip/dist/types'

export type TooltipContentProps = {
  children?: React.ReactNode
  visible?: boolean
  popperTooltipProps?: ReturnType<ReturnType<typeof usePopperTooltip>['getTooltipProps']>
  /**
   * Spring animation config switched by `scale` or `opacity`
   */
  animation?: Record<'from' | 'enter' | 'leave', Record<string, any>>
  styles?: React.CSSProperties
}

export const defaultTooltipPosition = {
  top: '-1000px',
  left: '-1000px',
  transform: 'none',
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>((props, ref) => {
  if (typeof window === 'undefined') {
    return null
  }
  return (
    <Transition
      items={props.visible}
      from={{ ...props.animation?.from }}
      enter={{ ...props.animation?.enter }}
      leave={{ ...props.animation?.leave }}
      config={config.stiff}
      delay={200}
    >
      {(styles, item) =>
        item && (
          <StyledTooltipContent
            className="mayumi-tooltip-content"
            style={{
              ...props.popperTooltipProps?.style,
              ...styles,
              ...props.styles,
            }}
            ref={ref}
          >
            {props.children}
          </StyledTooltipContent>
        )
      }
    </Transition>
  )
})

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
  offset?: [number, number]
  trigger?: 'hover' | 'click'
  defaultVisible?: boolean
  visible?: boolean
  className?: string
  style?: React.CSSProperties
  outsideCloseable?: boolean
  /**
   * Animation effect
   * @default `opacity`
   */
  animation?: Animation
  onVisibleChange: Config['onVisibleChange']
  getPopupContainer?: () => HTMLElement
}

export const Tooltip = ({
  trigger = 'click',
  defaultVisible = false,
  animation = 'scale',
  placement = 'left',
  ...props
}: ToolTipProps) => {
  const parent = useRef<HTMLDivElement>(null)
  const { setTooltipRef, setTriggerRef, visible, getTooltipProps } = usePopperTooltip(
    {
      placement,
      defaultVisible,
      closeOnOutsideClick: props.outsideCloseable,
      trigger,
      offset: props.offset,
      visible: props.visible,
      onVisibleChange: props.onVisibleChange,
    },
    { strategy: 'absolute' },
  )
  return (
    <StyledTooltip
      className={cx('mayumi-tooltip', props.className)}
      ref={parent}
      style={props.style}
      id={props.id}
    >
      <div className="mayumi-tooltip-trigger" ref={setTriggerRef}>
        {props.children}
      </div>
      <TooltipContent
        visible={visible}
        ref={setTooltipRef}
        animation={getAnimationConfig(animation)}
        styles={getAnimationStyles(placement)}
        popperTooltipProps={getTooltipProps()}
      >
        {props.content}
      </TooltipContent>
    </StyledTooltip>
  )
}
