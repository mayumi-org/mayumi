import { createContext, useContext } from 'react'

export interface MenubarContextProps {
  color?: 'primary' | 'light-primary' | 'ghost'
  /**
   * @description Disable outline of subcontent and content
   */
  bordered?: boolean
  glass?: boolean
}

export const MenubarContext = createContext<MenubarContextProps>({})

export const useMenubarContext = () => useContext(MenubarContext)
