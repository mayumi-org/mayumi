import React, { useCallback } from 'react'
import cx from 'clsx'

import { StyledButton, button } from './styles'
import type { CSS } from '@/theme/config'
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  color?: 'primary' | 'gray'
  size?: 'md' | 'sm'
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  css?: CSS
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, color, disabled, size, className, ...props }, ref) => {
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onClick?.(e)
      },
      [onClick],
    )
    return (
      <StyledButton
        ref={ref}
        onClick={handleClick}
        color={color}
        disabled={disabled}
        size={size}
        className={cx('mayumi-button', button({ color, className }), {
          'mayumi-button__enabled': !disabled,
        })}
        {...props}
      >
        {props.children}
      </StyledButton>
    )
  },
)

Button.displayName = 'Button'
