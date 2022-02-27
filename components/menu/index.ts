import { SubMenu } from './menu-submenu'
import { MenuItem } from './menu-item'
import { Menu as InnerMenu } from './menu'
export { MenuProps } from './menu'

type _InnerMenu = typeof InnerMenu

interface MenuInterface extends _InnerMenu {
  Item: typeof MenuItem
  SubMenu: typeof SubMenu
}

export const Menu = InnerMenu as MenuInterface
Menu.Item = MenuItem
Menu.SubMenu = SubMenu
