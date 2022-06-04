import React from 'react'
import cx from 'clsx'

import { StyledBox } from './styles'
import type { CSS } from '@/theme/config'

export type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  transparent?: boolean
  bordered?: boolean
  css?: CSS
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
