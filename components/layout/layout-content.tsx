import React from 'react'
import cx from 'clsx'

import { StyledContent } from './styles'

type LayoutContentProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const LayoutContent = ({ children, className, ...props }: LayoutContentProps) => {
  return (
    <StyledContent className={cx('mayumi-layout-content', className)} {...props}>
      {children}
    </StyledContent>
  )
}
