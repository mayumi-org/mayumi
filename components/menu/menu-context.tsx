import { createContext, useContext } from 'react'
import { ClickParams } from './types'

export type MenuContextProps = {
  subMenuPopupVisible?: boolean
  handleSubMenuPopupVisible?: React.Dispatch<React.SetStateAction<boolean | undefined>>
  selectedKeys?: string[]
  handleSelect?: (params: ClickParams) => void
  menuTheme?: 'bgless' | 'default' | 'dark'
}

export const defaultValue: MenuContextProps = {
  subMenuPopupVisible: false,
}

export const MenuContext = createContext<MenuContextProps>(defaultValue)

export const useMenu = () => useContext(MenuContext)
