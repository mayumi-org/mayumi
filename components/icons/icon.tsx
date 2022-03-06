import React from 'react'
import cx from 'clsx'

import { StyledIcon } from './styles'

export const Icon = (props: React.HTMLAttributes<HTMLElement>) => {
  return <StyledIcon {...props} className={cx('mayumi-icon', props.className)} />
}
