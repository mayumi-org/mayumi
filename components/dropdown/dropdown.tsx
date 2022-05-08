import React, { useRef, useState } from 'react'
import cx from 'clsx'

import { Tooltip, ToolTipProps } from '@/tooltip'
import type { CSS } from '@/theme/config'

import { DropdownContext, defaultValue, DropdownContextProps } from './dropdown-context'
import { Trigger } from '@/tooltip/tooltip'

export type DropdownProps = {
  /**
   * Dropdown trigger
   */
  children?: React.ReactNode
  switchKey?: string
  /**
   * Dropdown popup content
   */
  content?: React.ReactNode
  /**
   * Dropdown visible
   */
  visible?: boolean
  getPopupContainer?: () => HTMLElement
  trigger?: ToolTipProps['trigger']
  /**
   * Dropdown collapsed menu trigger
   * @default `hover`
   */
  collapsedTrigger?: ToolTipProps['trigger']
  /**
   * Dropdown popup content placement
   * @default `bottom-start`
   */
  placement?: ToolTipProps['placement']
  outsideCloseable?: ToolTipProps['outsideCloseable']
  glassmorphism?: ToolTipProps['glassmorphism']
  css?: CSS
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'id' | 'className'>

export const Dropdown = ({
  placement = 'bottom-start',
  trigger = 'click',
  collapsedTrigger = 'click',
  outsideCloseable = true,
  ...props
}: DropdownProps) => {
  const child = useRef<HTMLDivElement>(null)
  const mode: DropdownContextProps['mode'] = 'switchKey' in props ? 'switch' : 'nest'
  const [visible, setVisible] = useState(props.visible || defaultValue.visible)
  const [collapsedVisible, setCollapsedVisible] = useState<boolean>(false)
  const controlledVisible = 'visible' in props ? props.visible : visible
  return (
    <DropdownContext.Provider
      value={{
        ...defaultValue,
        switchKey: props.switchKey,
        mode,
        visible: controlledVisible,
        isDropdown: true,
        onChangeVisible: setVisible,
        collapsedVisible,
        onChangeCollapsedVisible: setCollapsedVisible,
        glassmorphism: props.glassmorphism,
        collapsedTrigger: collapsedTrigger as Trigger,
      }}
    >
      <Tooltip
        content={<div ref={child}>{props.content}</div>}
        visible={controlledVisible}
        placement={placement}
        onVisibleChange={setVisible}
        trigger={trigger}
        animation="opacity"
        glassmorphism={props.glassmorphism}
        outsideCloseable={outsideCloseable}
        className={cx('mayumi-dropdown', props.className)}
        {...props}
      >
        {props.children}
      </Tooltip>
    </DropdownContext.Provider>
  )
}
