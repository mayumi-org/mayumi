import { Layout as _Layout } from './layout'
import { LayoutAside } from './layout-aside'
import { LayoutMain } from './layout-main'
import { LayoutNavigate } from './layout-navigate'
export type { LayoutProps } from './layout'

type InnerLayout = typeof _Layout
interface LayoutInterface extends InnerLayout {
  Aside: typeof LayoutAside
  Main: typeof LayoutMain
  Navigate: typeof LayoutNavigate
}

export const Layout = _Layout as LayoutInterface
Layout.Aside = LayoutAside
Layout.Main = LayoutMain
Layout.Navigate = LayoutNavigate
