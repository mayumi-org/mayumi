import React, { useCallback } from 'react'
import cx from 'clsx'

import { StyledButton } from './styles'

export type ButtonProps = {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  // size?: 'sm' | 'lg'
  className?: string
  style?: React.CSSProperties
}

export const Button: React.FC<ButtonProps> = ({ onClick, ...props }) => {
  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onClick?.(e)
    },
    [onClick],
  )
  return (
    <StyledButton
      onClick={handleOnClick}
      // size={size}
      className={cx('mayumi-button', props.className)}
      {...props}
    >
      {props.children}
    </StyledButton>
  )
}
