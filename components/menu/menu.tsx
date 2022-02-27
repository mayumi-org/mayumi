import React, { useCallback, useRef, useState } from 'react'
import { useSpring } from '@react-spring/web'
import cx from 'clsx'

// import { useDropdown } from '@components/dropdown/dropdown-context'
// import { getRect } from '../tooltip/utils'
import { defaultValue, MenuContext, MenuContextProps } from './menu-context'
import { StyledMenu } from './styles'

export type MenuProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  selectedKeys?: MenuContextProps['selectedKeys']
  /**
   * Menu size
   * @default `sm`
   */
  size?: MenuContextProps['size']
  // menuTheme?: MenuContextProps['menuTheme']
}

export const Menu = (props: MenuProps) => {
  // const { switchKey, mode } = useDropdown()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const isSwitchMode = false // mode === 'switch'
  // FIXME: auto -> undefined, fix spring runtime error
  const [styles] = useSpring(() => ({
    height: isSwitchMode ? 0 : undefined,
    opacity: isSwitchMode ? 0 : 1,
  }))
  const parent = useRef<HTMLDivElement>(null)
  // const prev = useRef<string>()
  // useEffect(() => {
  //   if (!isSwitchMode) {
  //     return
  //   }
  //   if (prev.current && switchKey !== prev.current) {
  //     const { height } = getRect(parent)
  //     api.start({ height })
  //     prev.current = switchKey
  //   }
  //   if (!prev.current) {
  //     const { height } = getRect(parent)
  //     api.start({ height, opacity: 1 })
  //     prev.current = switchKey
  //   }
  // }, [switchKey, prev, parent, api, isSwitchMode])
  const [subMenuPopupVisible, setSubMenuPopupVisible] = useState(defaultValue.subMenuPopupVisible)
  const handleSelect = useCallback((itemKey: string) => {
    setSelectedKeys([itemKey])
  }, [])
  return (
    <MenuContext.Provider
      value={{
        subMenuPopupVisible,
        selectedKeys: props.selectedKeys || selectedKeys || [],
        size: props.size || defaultValue.size,
        handleSubMenuPopupVisible: (p) => {
          console.log(p)
          setSubMenuPopupVisible((prev) => !prev)
        },
        handleSelect,
        // menuTheme: props.menuTheme,
      }}
    >
      <StyledMenu
        style={{ ...styles, ...props.style }}
        className={cx('mayumi-menu', props.className)}
        onClick={props.onClick}
      >
        <div ref={parent} className="mayumi-menu-inner">
          {props.children}
        </div>
      </StyledMenu>
    </MenuContext.Provider>
  )
}
