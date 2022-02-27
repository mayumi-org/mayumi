import React, { useContext } from 'react'
import { ToolTipProps } from '@/tooltip'

export type DropdownContextProps = {
  mode: 'switch' | 'nest'
  switchKey?: string
  activeKey?: string
  visible?: boolean
  /**
   * Dropdown collapsed menu visible
   */
  collapsedVisible?: boolean
  /**
   * Control dropdown collapsed menu visible
   */
  onChangeCollapsedVisible: (value: boolean) => void
  onChangeVisible: (value: boolean) => void
  /**
   * Is under dropdown context
   */
  isDropdown?: boolean
  glassmorphism?: ToolTipProps['glassmorphism']
}

export const defaultValue: DropdownContextProps = {
  mode: 'nest',
  activeKey: undefined,
  visible: false,
  collapsedVisible: false,
  onChangeCollapsedVisible: (_value: boolean) => undefined,
  onChangeVisible: (_value: boolean) => undefined,
  glassmorphism: false,
}

export const DropdownContext = React.createContext(defaultValue)

export const useDropdown = () => useContext(DropdownContext)
