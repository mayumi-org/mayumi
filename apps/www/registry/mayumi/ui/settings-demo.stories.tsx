import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { GroupedList, GroupedListItem } from "./grouped-list"
import { SearchField } from "./search-field"
import { Sidebar } from "./sidebar"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"
import { TitleBar } from "./titlebar"
import { Toolbar, ToolbarTitle } from "./toolbar"
import { TrafficLights } from "./traffic-lights"
import { Window, WindowBody } from "./window"

const meta: Meta = { title: "demo/Settings" }
export default meta

export const SettingsWindow: StoryObj = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Window className="h-[560px] w-[820px] flex-row">
        <Sidebar width={220} className="h-full">
          <div className="flex h-12 shrink-0 items-center px-1">
            <TrafficLights />
          </div>
          <SearchField placeholder="搜索" />
          <SidebarNav>
            <SidebarNavItem>
              <SidebarNavIcon className="bg-traffic-zoom" />
              Wi-Fi
            </SidebarNavItem>
            <SidebarNavItem>
              <SidebarNavIcon />
              蓝牙
            </SidebarNavItem>
            <SidebarNavItem>
              <SidebarNavIcon className="bg-traffic-minimize" />
              网络
            </SidebarNavItem>
            <SidebarNavItem active>
              <SidebarNavIcon className="bg-traffic-close" />
              隐私与安全性
            </SidebarNavItem>
          </SidebarNav>
        </Sidebar>
        <div className="flex min-w-0 flex-1 flex-col">
          <TitleBar>
            <Toolbar>
              <Button variant="ghost" size="sm" className="app-region-no-drag" aria-label="返回">
                ←
              </Button>
              <ToolbarTitle className="ml-1">隐私与安全性</ToolbarTitle>
            </Toolbar>
          </TitleBar>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-6">
            <GroupedList>
              <GroupedListItem
                icon={<SidebarNavIcon className="bg-traffic-minimize" />}
                label="专注模式"
                value="0"
                chevron
                onClick={() => {}}
              />
              <GroupedListItem
                icon={<SidebarNavIcon />}
                label="自动化"
                value="10"
                chevron
                onClick={() => {}}
              />
              <GroupedListItem
                icon={<SidebarNavIcon className="bg-traffic-close" />}
                label="App 管理"
                value="2"
                chevron
                onClick={() => {}}
              />
            </GroupedList>
            <GroupedList>
              <GroupedListItem
                label="敏感内容警告"
                description="检测敏感图片与视频"
                value="关闭"
                chevron
                onClick={() => {}}
              />
            </GroupedList>
          </div>
        </div>
      </Window>
    </div>
  ),
}
