import React from 'react'
import cx from 'clsx'

import { StyledSeparator } from './styles'
import { CSS } from '@/theme/config'

export type SeparatorProps = {
  style?: React.CSSProperties
  className?: string
  type?: 'horizontal' | 'vertical'
  css?: CSS
}

export const Separator = ({ type = 'horizontal', ...props }: SeparatorProps) => {
  return (
    <StyledSeparator className={cx('mayumi-separator', props.className)} type={type} {...props} />
  )
}
