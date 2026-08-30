import { Bluetooth, Settings, Wifi } from "lucide-react"

import {
  SidebarNav,
  SidebarNavIcon,
  SidebarNavItem,
} from "@/registry/mayumi/ui/sidebar-nav"

export function SidebarNavDemo() {
  return (
    <SidebarNav className="w-56">
      <SidebarNavItem>
        <SidebarNavIcon className="bg-traffic-close">
          <Settings aria-hidden="true" />
        </SidebarNavIcon>
        通用
      </SidebarNavItem>
      <SidebarNavItem active>
        <SidebarNavIcon className="bg-traffic-zoom">
          <Wifi aria-hidden="true" />
        </SidebarNavIcon>
        Wi-Fi
      </SidebarNavItem>
      <SidebarNavItem>
        <SidebarNavIcon className="bg-traffic-minimize">
          <Bluetooth aria-hidden="true" />
        </SidebarNavIcon>
        蓝牙
      </SidebarNavItem>
    </SidebarNav>
  )
}
