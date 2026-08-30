"use client"

import { AppWindow, Moon } from "lucide-react"

import { GroupedList, GroupedListItem } from "@/registry/mayumi/ui/grouped-list"
import { SidebarNavIcon } from "@/registry/mayumi/ui/sidebar-nav"
import { Switch } from "@/registry/mayumi/ui/switch"

export function GroupedListDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <GroupedList>
        <GroupedListItem
          icon={
            <SidebarNavIcon className="bg-traffic-minimize">
              <Moon aria-hidden="true" />
            </SidebarNavIcon>
          }
          label="专注模式"
          value="0"
          chevron
          onClick={() => {}}
        />
        <GroupedListItem
          icon={
            <SidebarNavIcon className="bg-traffic-close">
              <AppWindow aria-hidden="true" />
            </SidebarNavIcon>
          }
          label="App 管理"
          value="2"
          chevron
          onClick={() => {}}
        />
      </GroupedList>
      <GroupedList>
        <GroupedListItem
          label="允许通知"
          description="来自 App 与网站的通知"
          value={<Switch aria-label="允许通知" defaultChecked />}
        />
      </GroupedList>
    </div>
  )
}
