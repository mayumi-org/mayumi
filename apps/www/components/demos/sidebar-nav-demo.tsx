import { Bluetooth, Inbox, Settings, Star, Wifi } from "lucide-react"

import { Badge } from "@/registry/mayumi/ui/badge"
import {
  SidebarNav,
  SidebarNavIcon,
  SidebarNavItem,
} from "@/registry/mayumi/ui/sidebar-nav"

export function SidebarNavDemo() {
  return (
    <div className="flex flex-wrap gap-6">
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
      <SidebarNavItem trailing="已连接">
        <SidebarNavIcon className="bg-traffic-minimize">
          <Bluetooth aria-hidden="true" />
        </SidebarNavIcon>
        蓝牙
      </SidebarNavItem>
      </SidebarNav>
      <SidebarNav className="w-56">
        <SidebarNavItem variant="neutral" active trailing={<Badge tone="neutral" count={12} />}>
          <Inbox aria-hidden="true" className="size-4 text-fg-tertiary" />
          收件箱
        </SidebarNavItem>
        <SidebarNavItem variant="neutral" trailing="⌘2">
          <Star aria-hidden="true" className="size-4 text-fg-tertiary" />
          收藏
        </SidebarNavItem>
      </SidebarNav>
    </div>
  )
}
