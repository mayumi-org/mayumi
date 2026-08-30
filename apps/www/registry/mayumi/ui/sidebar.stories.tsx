import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bluetooth, Wifi } from "lucide-react"
import { Button } from "./button"
import { SearchField } from "./search-field"
import { Sidebar } from "./sidebar"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"
import { Window, WindowBody } from "./window"

const meta: Meta<typeof Sidebar> = {
  title: "ui/Sidebar",
  component: Sidebar,
}
export default meta

type Story = StoryObj<typeof Sidebar>

function CollapsibleDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="p-8">
      <Window className="h-96 w-[640px]">
        <WindowBody>
          <Sidebar collapsed={collapsed}>
            <SearchField placeholder="搜索" />
            <SidebarNav>
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
          </Sidebar>
          <div className="flex flex-1 items-start p-4">
            <Button onClick={() => setCollapsed((c) => !c)}>
              {collapsed ? "展开侧栏" : "收起侧栏"}
            </Button>
          </div>
        </WindowBody>
      </Window>
    </div>
  )
}

export const Collapsible: Story = { render: () => <CollapsibleDemo /> }
