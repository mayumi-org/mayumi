import React from 'react'
import cx from 'clsx'

import { StyledKbd } from './styles'

type KbdProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactText
  className?: string
}

export const Kbd = ({ className, children, ...props }: KbdProps) => {
  return (
    <StyledKbd className={cx('mayumi-kbd', className)} {...props}>
      {children}
    </StyledKbd>
  )
}
