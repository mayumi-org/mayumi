import React, { useCallback } from 'react'
import cx from 'clsx'

import { StyledButton } from './styles'
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
  ({ onClick, ...props }, ref) => {
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
        color={props.color}
        size={props.size}
        disabled={props.disabled}
        className={cx('mayumi-button', props.className, {
          'mayumi-button__enabled': !props.disabled,
        })}
        {...props}
      >
        {props.children}
      </StyledButton>
    )
  },
)

Button.displayName = 'Button'
