import React from 'react'
import cx from 'clsx'

import { StyledLayout } from './styles'
import type { CSS } from '@/theme/config'

export type LayoutProps = React.HTMLAttributes<HTMLElement> & {
  size?: 'screen' | 'full'
  css?: CSS
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
