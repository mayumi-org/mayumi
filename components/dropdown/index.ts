import { Dropdown as InnerDropdown } from './dropdown'
import { DropdownMenuItem, DropdownMenu } from './dropdown-menu'
import { SubMenu } from '@/menu/menu-submenu'
export type { DropdownProps } from './dropdown'

type _InnerDropdownMenu = typeof InnerDropdown

interface DropdownInterface extends _InnerDropdownMenu {
  Item: typeof DropdownMenuItem
  SubMenu: typeof SubMenu
  Menu: typeof DropdownMenu
}

export const Dropdown = InnerDropdown as DropdownInterface

Dropdown.Item = DropdownMenuItem
Dropdown.SubMenu = SubMenu
Dropdown.Menu = DropdownMenu
