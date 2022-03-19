import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { config, Transition } from '@react-spring/web'
import cx from 'clsx'
import { usePopperTooltip } from 'react-popper-tooltip'
import { Config } from 'react-popper-tooltip/dist/types'

import type { CSS } from '@/theme/config'

import { getAnimationConfig, Animation, getAnimationStyles } from './utils'
import { StyledTooltip, StyledTooltipContent } from './styles'

export type TooltipContentProps = {
  children?: React.ReactNode
  visible?: boolean
  popperTooltipProps?: ReturnType<ReturnType<typeof usePopperTooltip>['getTooltipProps']>
  /**
   * Spring animation config switched by `scale` or `opacity`
   */
  animation?: Record<'from' | 'enter' | 'leave', Record<string, any>>
  styles?: React.CSSProperties
  glassmorphism?: boolean
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
            glassmorphism={props.glassmorphism}
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
   * @default `click`
   */
  children?: React.ReactNode
  /**
   * Tooltip popover content
   */
  content?: React.ReactNode
  /**
   * Tooltip popover content placement
   * @default `bottom`
   */
  placement?: Config['placement']
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
  onVisibleChange?: Config['onVisibleChange']
  glassmorphism?: TooltipContentProps['glassmorphism']
  getPopupContainer?: () => HTMLElement
  css?: CSS
}

export const Tooltip = ({
  trigger = 'click',
  defaultVisible = false,
  animation = 'opacity',
  placement = 'bottom',
  outsideCloseable = true,
  ...props
}: ToolTipProps) => {
  const parent = useRef<HTMLDivElement>(null)
  const { setTooltipRef, setTriggerRef, visible, getTooltipProps } = usePopperTooltip(
    {
      placement,
      defaultVisible,
      closeOnOutsideClick: outsideCloseable,
      trigger,
      offset: props.offset,
      visible: props.visible,
      onVisibleChange: props.onVisibleChange,
    },
    { strategy: 'absolute' },
  )
  const hasCustomContainer = 'getPopupContainer' in props
  if (typeof window === 'undefined') {
    return null
  }
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
      {hasCustomContainer &&
        ReactDOM.createPortal(
          <TooltipContent
            visible={visible}
            ref={setTooltipRef}
            animation={getAnimationConfig(animation)}
            styles={getAnimationStyles(placement)}
            popperTooltipProps={getTooltipProps()}
            glassmorphism={props.glassmorphism}
          >
            {props.content}
          </TooltipContent>,
          props.getPopupContainer?.() || document.body,
        )}
      {!hasCustomContainer && (
        <TooltipContent
          visible={visible}
          ref={setTooltipRef}
          animation={getAnimationConfig(animation)}
          styles={getAnimationStyles(placement)}
          popperTooltipProps={getTooltipProps()}
          glassmorphism={props.glassmorphism}
        >
          {props.content}
        </TooltipContent>
      )}
    </StyledTooltip>
  )
}
