import React from 'react'
import cx from 'clsx'

import { StyledIcon } from './styles'
import type { CSS } from '@/theme/config'

export type IconProps = React.HTMLAttributes<HTMLElement> & { css?: CSS }

export const Icon = React.forwardRef<HTMLElement, IconProps>((props, ref) => {
  return <StyledIcon ref={ref} {...props} className={cx('mayumi-icon', props.className)} />
})

Icon.displayName = 'Icon'
