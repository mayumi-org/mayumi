import React from 'react'

import { Separator } from '@/separator'

export type SubMenuProps = {
  title?: React.ReactNode
  children?: React.ReactNode
  itemKey?: React.Key
}

export const SubMenu = (props: SubMenuProps) => {
  return (
    <>
      <p className="mayumi-menu-subtitle">{props.title}</p>
      <ul className="mayumi-menu-submenu">{props.children}</ul>
      <Separator type="horizontal" css={{ my: '$1' }} />
    </>
  )
}
