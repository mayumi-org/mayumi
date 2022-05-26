import React, { useContext } from 'react'

export type ModalContextProps = {
  visible?: boolean
  handleClickOutside?: () => void
}

export const defaultValue: ModalContextProps = {
  visible: false,
}

export const ModalContext = React.createContext(defaultValue)

export const useModal = () => useContext(ModalContext)
