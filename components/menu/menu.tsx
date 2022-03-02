import React, { useCallback, useState, useEffect } from 'react'
import { useSpring } from '@react-spring/web'
import cx from 'clsx'
import useMeasure from 'react-use-measure'

import { useDropdown } from '@/dropdown/dropdown-context'
import { defaultValue, MenuContext, MenuContextProps } from './menu-context'
import { StyledMenu } from './styles'
import { ClickParams } from './types'

export type MenuProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (params: ClickParams) => void
  selectedKeys?: MenuContextProps['selectedKeys']
  /**
   * Menu size
   * @default `sm`
   */
  size?: 'sm' | 'md' | 'lg'
}

export const Menu = (props: MenuProps) => {
  const { mode } = useDropdown()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const isSwitchMode = mode === 'switch'
  const [styles, api] = useSpring(() => ({
    height: isSwitchMode ? 0 : 'auto',
    opacity: isSwitchMode ? 0 : 1,
  }))
  const [parent, { height }, forceRefresh] = useMeasure()
  useEffect(() => {
    if (!isSwitchMode || !height) {
      return
    }
    forceRefresh()
    api.start({ height, opacity: 1 })
  }, [height, api, forceRefresh, isSwitchMode])
  const [subMenuPopupVisible, setSubMenuPopupVisible] = useState(defaultValue.subMenuPopupVisible)
  const handleSelect = useCallback(
    (params: ClickParams) => {
      // multiple selected is not allowed
      // promise `!` is ok
      setSelectedKeys([params.itemKey!])
      props.onClick?.({ itemKey: params.itemKey, domEvent: params.domEvent })
    },
    [props],
  )
  return (
    <MenuContext.Provider
      value={{
        subMenuPopupVisible,
        selectedKeys: props.selectedKeys || selectedKeys || [],
        handleSubMenuPopupVisible: setSubMenuPopupVisible,
        handleSelect,
      }}
    >
      <StyledMenu
        style={{ ...styles, ...props.style }}
        className={cx('mayumi-menu', props.className)}
        onClick={(e) => props.onClick?.({ domEvent: e })}
        switch={isSwitchMode}
        size={props.size}
      >
        <div ref={parent} className="mayumi-menu-inner">
          {props.children}
        </div>
      </StyledMenu>
    </MenuContext.Provider>
  )
}
