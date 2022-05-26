import React, { useContext } from 'react'
import { ToolTipProps, Trigger } from '@/tooltip/tooltip'

export type DropdownContextProps = {
  mode: 'switch' | 'nest'
  switchKey?: string
  visible?: boolean
  /**
   * Dropdown collapsed menu visible
   */
  collapsedVisible?: boolean
  collapsedTrigger?: Trigger
  /**
   * Control dropdown collapsed menu visible
   */
  onChangeCollapsedVisible?: React.Dispatch<React.SetStateAction<boolean>>
  onChangeVisible?: React.Dispatch<React.SetStateAction<boolean | undefined>>
  /**
   * Is under dropdown context
   */
  isDropdown?: boolean
  glassmorphism?: ToolTipProps['glassmorphism']
}

export const defaultValue: DropdownContextProps = {
  mode: 'nest',
  visible: false,
  collapsedVisible: false,
  collapsedTrigger: 'hover',
  glassmorphism: false,
}

export const DropdownContext = React.createContext(defaultValue)

export const useDropdown = () => useContext(DropdownContext)
