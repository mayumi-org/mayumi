"use client"

import {
  CollapsibleSection,
  CollapsibleSectionPanel,
  CollapsibleSectionTrigger,
} from "@/registry/mayumi/ui/collapsible-section"
import { SidebarNav, SidebarNavItem } from "@/registry/mayumi/ui/sidebar-nav"

export function CollapsibleSectionDemo() {
  return (
    <div className="w-56 space-y-1">
      <CollapsibleSection defaultOpen>
        <CollapsibleSectionTrigger>收藏</CollapsibleSectionTrigger>
        <CollapsibleSectionPanel>
          <SidebarNav aria-label="收藏">
            <SidebarNavItem active>下载</SidebarNavItem>
            <SidebarNavItem>文稿</SidebarNavItem>
            <SidebarNavItem>桌面</SidebarNavItem>
          </SidebarNav>
        </CollapsibleSectionPanel>
      </CollapsibleSection>
      <CollapsibleSection>
        <CollapsibleSectionTrigger>位置</CollapsibleSectionTrigger>
        <CollapsibleSectionPanel>
          <SidebarNav aria-label="位置">
            <SidebarNavItem>iCloud 云盘</SidebarNavItem>
            <SidebarNavItem>网络</SidebarNavItem>
          </SidebarNav>
        </CollapsibleSectionPanel>
      </CollapsibleSection>
    </div>
  )
}
