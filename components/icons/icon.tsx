import React from 'react'
import cx from 'clsx'

export const Icon = (props: React.HTMLAttributes<HTMLElement>) => {
  return <i {...props} className={cx('mayumi-icon', props.className)} />
}
