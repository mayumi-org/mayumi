import React, { useCallback } from 'react'

import { StyledButton } from './styles'

export type ButtonProps = {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  size?: 'sm' | 'lg'
  className?: string
  style?: React.CSSProperties
}

export const Button = ({ onClick, size = 'lg', ...props }: ButtonProps) => {
  const handleOnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onSelected?.(props.itemKey)
      onClick?.(e)
    },
    [onClick, onSelected, props.itemKey],
  )
  return (
    <StyledButton
      onClick={handleOnClick}
      size={size}
      data-role="button"
      className={cx('button', props.className)}
      selected={selected}
      {...props}
    >
      {props.children}
    </StyledButton>
  )
}
