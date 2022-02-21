import React from 'react'
import cx from 'clsx'

import { StyledBox } from './styles'

export type BoxProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  transparent?: boolean
  bordered?: boolean
  onClick?: () => void
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, style, className, ...props }: BoxProps, ref) => {
    return (
      <StyledBox className={cx('mayumi-box', className)} ref={ref} style={style} {...props}>
        {children}
      </StyledBox>
    )
  },
)

Box.displayName = 'Box'
