import React from 'react'

import { Separator } from '@/separator'

export type SubMenuProps = {
  title?: React.ReactNode
  children?: React.ReactNode
  itemKey?: React.Key
}

export const SubMenu = React.forwardRef<HTMLDivElement, SubMenuProps>((props, ref) => {
  return (
    <div ref={ref} className="mayumi-menu-submenu">
      <p className="mayumi-menu-subtitle">{props.title}</p>
      <ul className="mayumi-menu-submenu-content">{props.children}</ul>
      <Separator type="horizontal" css={{ my: '$1' }} />
    </div>
  )
})

SubMenu.displayName = 'MenuSubMenu'
