import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CollapsibleSection,
  CollapsibleSectionPanel,
  CollapsibleSectionTrigger,
} from "./collapsible-section"
import { SidebarNav, SidebarNavItem } from "./sidebar-nav"

const meta: Meta<typeof CollapsibleSection> = {
  title: "ui/CollapsibleSection",
  component: CollapsibleSection,
}
export default meta

export const SidebarGroups: StoryObj<typeof CollapsibleSection> = {
  render: () => (
    <div className="w-60 space-y-1 p-6">
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
  ),
}
