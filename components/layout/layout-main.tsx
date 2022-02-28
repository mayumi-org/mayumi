import React from 'react'
import cx from 'clsx'

import { StyledMain } from './styles'

type LayoutMainProps = {
  children?: React.ReactNode
  className?: string
}

export const LayoutMain = ({ children, className }: LayoutMainProps) => {
  return <StyledMain className={cx('mayumi-layout-main', className)}>{children}</StyledMain>
}
