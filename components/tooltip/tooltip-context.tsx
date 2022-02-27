import React, { useContext } from 'react'
import { Animation } from './utils'

export type TooltipContextProps = {
  showArrow?: boolean
  animation?: Animation
  outsideCloseable?: boolean
}

export const defaultValue: TooltipContextProps = {
  showArrow: false,
  animation: 'opacity',
  outsideCloseable: true,
}

export const TooltipContext = React.createContext(defaultValue)

export const useTooltip = () => useContext(TooltipContext)
