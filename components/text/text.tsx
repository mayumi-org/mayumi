import React from 'react'
import cx from 'clsx'

import { StyledText } from './styles'
import type { FontWeight, TextSize, CSS } from '@/theme/config'

export type TextProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
  className?: string
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  h6?: boolean
  p?: boolean
  span?: boolean
  size?: TextSize
  weight?: FontWeight
  css?: CSS
  type?: 'secondary' | 'tertiary' | 'quaternary'
}

export const Text = ({ h1, h2, h3, h4, h5, h6, p, span, size, weight, ...props }: TextProps) => {
  const elements = { h1, h2, h3, h4, h5, h6, p, span }
  const names = Object.keys(elements).filter((name) => elements[name])
  const tag: any = names[0] || 'p'
  return (
    <StyledText
      {...props}
      as={tag}
      css={{
        text: size ? `$${size}` : undefined,
        fontWeight: weight ? `$${weight}` : undefined,
        ...props.css,
      }}
      className={cx('mayumi-text', props.className)}
    >
      {props.children}
    </StyledText>
  )
}
