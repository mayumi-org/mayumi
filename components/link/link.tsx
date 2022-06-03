import React from 'react'
import cx from 'clsx'

import { StyledLink } from './styles'

export type LinkProps = React.AnchorHTMLAttributes<unknown> & {
  /**
   * hover effect
   * - default change opacity
   * - reverse change text color
   * @default 'light'
   */
  animation?: 'light' | 'reverse'
}

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <StyledLink className={cx('mayumi-link', className)} {...props}>
      {children}
    </StyledLink>
  )
}
