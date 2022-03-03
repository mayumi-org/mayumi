import React from 'react'
import cx from 'clsx'

import { StyledMain } from './styles'
import type { CSS } from '@/theme/config'

type LayoutMainProps = React.HTMLAttributes<HTMLDivElement> & {
  css?: CSS
}

export const LayoutMain = ({ children, className, ...props }: LayoutMainProps) => {
  return (
    <StyledMain {...props} className={cx('mayumi-layout-main', className)}>
      {children}
    </StyledMain>
  )
}
