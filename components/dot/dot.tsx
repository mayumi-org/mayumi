import React from 'react'
import cx from 'clsx'

import { StyledDot } from './styles'
import type { CSS } from '@/theme/config'

export type DotProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string
  css?: CSS
  type?: 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

export const Dot = ({ className, ...props }: DotProps) => {
  return <StyledDot className={cx('mayumi-dot', className)} {...props} />
}
