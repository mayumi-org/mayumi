import type { Meta, StoryObj } from "@storybook/react-vite"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"

const meta: Meta<typeof SidebarNav> = {
  title: "ui/SidebarNav",
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
