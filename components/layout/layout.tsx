import React from 'react'
import cx from 'clsx'

import { StyledLayout } from './styles'

export type LayoutProps = React.HTMLAttributes<HTMLElement> & {
  size?: 'screen' | 'full'
}

/**
 * Layout display like that
 * ┌──────────────┐
 * │  layout      │
 *┌───────┐──────┐
 *│ aside │ main │
 *└──────┘──────┘
 */
export const Layout = ({ className, children, ...props }: LayoutProps) => {
  return (
    <StyledLayout {...props} size={props.size} className={cx('mayumi-layout', className)}>
      {children}
    </StyledLayout>
  )
}
