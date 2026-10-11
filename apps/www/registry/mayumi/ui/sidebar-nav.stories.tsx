import type { Meta, StoryObj } from "@storybook/react-vite"
import { GitPullRequest, Inbox, Star } from "lucide-react"
import { Badge } from "./badge"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"

const meta: Meta<typeof SidebarNav> = {
  title: "ui/Sidebar/SidebarNav",
  component: SidebarNav,
}
export default meta

type Story = StoryObj<typeof SidebarNav>

export const Default: Story = {
  render: () => (
    <div className="w-56 p-6">
      <SidebarNav>
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
    </div>
  ),
}

export const NeutralWithTrailing: Story = {
  render: () => (
    <div className="w-56 p-6">
      <SidebarNav>
        <SidebarNavItem variant="neutral" trailing={<Badge tone="neutral" count={12} />}>
          <Inbox aria-hidden="true" className="size-4 text-fg-tertiary" />
          收件箱
        </SidebarNavItem>
        <SidebarNavItem
          variant="neutral"
          active
          trailing={<GitPullRequest aria-hidden="true" className="text-accent" />}
        >
          <span className="min-w-0 truncate">按 DESIGN.md 重做 HTML 模板</span>
        </SidebarNavItem>
        <SidebarNavItem variant="neutral" trailing="⌘3">
          <Star aria-hidden="true" className="size-4 text-fg-tertiary" />
          收藏
        </SidebarNavItem>
      </SidebarNav>
    </div>
  ),
}
