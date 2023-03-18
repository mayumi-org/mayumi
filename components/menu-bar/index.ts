import {
  MenuBarContent,
  MenuBarItem,
  MenuBarRoot,
  MenuBarSubTriger,
  MenuBarTriger,
  MenuBarSubContent,
  MenuBarItemRightSlot,
} from './menu-bar'
import { Portal, Menu, Sub } from '@radix-ui/react-menubar'

export const Menubar = {
  Root: MenuBarRoot,
  Content: MenuBarContent,
  Item: MenuBarItem,
  ItemRightSlot: MenuBarItemRightSlot,
  Trigger: MenuBarTriger,
  Portal,
  Menu,
  Sub,
  SubTrigger: MenuBarSubTriger,
  SubContent: MenuBarSubContent,
}
