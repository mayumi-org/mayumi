import React, { useCallback } from 'react'
import cx from 'clsx'

import { StyledButton, button } from './styles'
import type { CSS } from '@/theme/config'

export type ButtonProps = {
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
        className={cx(
          'mayumi-button',
          props.className,
          button({
            disabled: props.disabled,
            size: props.size,
          }),
          {
            'mayumi-button__enabled': !props.disabled,
          },
        )}
        {...props}
      >
        {props.children}
      </StyledButton>
    )
  },
)

Button.displayName = 'Button'
