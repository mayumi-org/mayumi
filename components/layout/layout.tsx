import React from 'react'
import cx from 'clsx'

import { StyledLayout } from './styles'

export type LayoutProps = {
  children?: React.ReactNode
  className?: string
}

/**
 * Layout display like that
 * ┌──────────────┐
 * │  layout      │
 *┌───────┐──────┐
 *│ aside │ main │
 *└──────┘──────┘
 */
export const Layout = ({ className, ...props }: LayoutProps) => {
  return <StyledLayout className={cx('mayumi-layout', className)}>{props.children}</StyledLayout>
}
