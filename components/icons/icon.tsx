import React from 'react'
import cx from 'clsx'

import { StyledIcon } from './styles'
import type { CSS } from '@/theme/config'

export type IconProps = React.HTMLAttributes<HTMLElement> & { css?: CSS }

export const Icon = (props: IconProps) => {
  return <StyledIcon {...props} className={cx('mayumi-icon', props.className)} />
}
