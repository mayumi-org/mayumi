import React from 'react'
import cx from 'clsx'

import { StyledNav } from './styles'
import type { CSS } from '@/theme/config'

type NavProps = React.HTMLAttributes<HTMLDivElement> & {
  css?: CSS
  top?: React.ReactNode
  bottom?: React.ReactNode
}

export const LayoutNavigate = (props: NavProps) => {
  return (
    <StyledNav className={cx('mayumi-layout-navigate', props.className)}>
      <div className="mayumi-layout-navigate-top">{props.top}</div>
      {props.bottom && <div className="mayumi-layout-navigate-bottom">{props.bottom}</div>}
    </StyledNav>
  )
}
