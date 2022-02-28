import React from 'react'
import cx from 'clsx'

import { StyledLayout } from './styles'

export type LayoutProps = {
  children?: React.ReactNode
  className?: string
}

export const Layout = ({ className, ...props }: LayoutProps) => {
  return <StyledLayout className={cx('mayumi-layout', className)}>{props.children}</StyledLayout>
}
