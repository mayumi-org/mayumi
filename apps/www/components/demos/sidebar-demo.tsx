"use client"

import { useState } from "react"

import { Button } from "@/registry/mayumi/ui/button"
import { SearchField } from "@/registry/mayumi/ui/search-field"
import { Sidebar } from "@/registry/mayumi/ui/sidebar"
import {
  SidebarNav,
  SidebarNavIcon,
  SidebarNavItem,
} from "@/registry/mayumi/ui/sidebar-nav"
import { Window, WindowBody } from "@/registry/mayumi/ui/window"

export function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Window className="h-72 w-full max-w-2xl">
      <WindowBody>
        <Sidebar collapsed={collapsed}>
          <SearchField placeholder="搜索" />
          <SidebarNav>
            <SidebarNavItem active>
              <SidebarNavIcon className="bg-traffic-zoom" />
              Wi-Fi
            </SidebarNavItem>
            <SidebarNavItem>
              <SidebarNavIcon className="bg-traffic-minimize" />
              蓝牙
            </SidebarNavItem>
          </SidebarNav>
        </Sidebar>
        <div className="flex flex-1 items-start p-4">
          <Button onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? "展开侧栏" : "收起侧栏"}
          </Button>
        </div>
      </WindowBody>
    </Window>
  )
}
