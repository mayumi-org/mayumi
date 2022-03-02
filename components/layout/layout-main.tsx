import React from 'react'
import cx from 'clsx'

import { StyledMain } from './styles'

type LayoutMainProps = React.HTMLAttributes<HTMLDivElement>

export const LayoutMain = ({ children, className, ...props }: LayoutMainProps) => {
  return (
    <StyledMain {...props} className={cx('mayumi-layout-main', className)}>
      {children}
    </StyledMain>
  )
}
