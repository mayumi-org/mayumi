import React from 'react'
import cx from 'clsx'

import { StyledSeparator } from './styles'
import type { CSS } from '@/theme/config'

export type SeparatorProps = {
  style?: React.CSSProperties
  className?: string
  type?: 'horizontal' | 'vertical'
  css?: CSS
}

export const Separator = ({ type = 'horizontal', css, ...props }: SeparatorProps) => {
  return (
    <StyledSeparator
      className={cx('mayumi-separator', props.className)}
      type={type}
      css={css}
      {...props}
    />
  )
}
