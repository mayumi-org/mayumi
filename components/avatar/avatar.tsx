import React, { useMemo } from 'react'
import cx from 'clsx'
import type { Space, Shadow, CSS } from '@/theme/config'

import { StyledAvatar } from './styles'

export type AvatarProps = {
  size?: Space
  src?: string
  shadow?: Shadow
  className?: string
  style?: React.CSSProperties
  css?: CSS
}

export const Avatar = (props: AvatarProps) => {
  const size: string = useMemo(() => {
    if (typeof props.size === 'number') {
      return `${props.size}px`
    }
    if (props.size) {
      return `$${props.size}`
    }
    return '$10'
  }, [props.size])
  return (
    <StyledAvatar
      className={cx('mayumi-avatar', props.className)}
      style={props.style}
      css={{
        size,
        boxShadow: props.shadow ? `$${props.shadow}` : '',
      }}
    >
      <img className="mayumi-avatar-image" src={props.src} />
    </StyledAvatar>
  )
}
