import {
  SidebarNav,
  SidebarNavIcon,
  SidebarNavItem,
} from "@/registry/mayumi/ui/sidebar-nav"

export function SidebarNavDemo() {
  return (
    <SidebarNav className="w-56">
      <SidebarNavItem>
        <SidebarNavIcon className="bg-traffic-close" />
        通用
      </SidebarNavItem>
      <SidebarNavItem active>
        <SidebarNavIcon className="bg-traffic-zoom" />
        Wi-Fi
      </SidebarNavItem>
      <SidebarNavItem>
        <SidebarNavIcon className="bg-traffic-minimize" />
        蓝牙
      </SidebarNavItem>
    </SidebarNav>
  )
}
