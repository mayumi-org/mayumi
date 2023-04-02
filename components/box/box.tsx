import React from 'react'
import cx from 'clsx'

import { StyledBox, box } from './styles'
import type { CSS } from '@/theme/config'

export type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  transparent?: boolean
  /**
   * @description Disable black outline
   */
  bordered?: boolean
  css?: CSS
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, style, className, bordered, transparent, ...props }: BoxProps, ref) => {
    return (
      <StyledBox
        className={cx('mayumi-box', box({ bordered, transparent, className }))}
        ref={ref}
        style={style}
        {...props}
      >
        {children}
      </StyledBox>
    )
  },
)

Box.displayName = 'Box'
