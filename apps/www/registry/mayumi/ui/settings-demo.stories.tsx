import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { GroupedList, GroupedListItem } from "./grouped-list"
import { SearchField } from "./search-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Sidebar } from "./sidebar"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"
import { Slider } from "./slider"
import { Switch } from "./switch"
import { TitleBar } from "./titlebar"
import { Toolbar, ToolbarTitle } from "./toolbar"
import { TrafficLights } from "./traffic-lights"
import { Window } from "./window"

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
            <GroupedList>
              <GroupedListItem
                label="允许通知"
                description="来自 App 与网站的通知"
                value={<Switch aria-label="允许通知" defaultChecked />}
              />
              <GroupedListItem
                label="外观"
                value={
                  <Select defaultValue="auto">
                    <SelectTrigger aria-label="外观">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">自动</SelectItem>
                      <SelectItem value="light">浅色</SelectItem>
                      <SelectItem value="dark">深色</SelectItem>
                    </SelectContent>
                  </Select>
                }
              />
              <GroupedListItem
                label="提示音音量"
                value={<Slider aria-label="提示音音量" defaultValue={60} className="w-32" />}
              />
            </GroupedList>
          </div>
        </div>
      </Window>
    </div>
  ),
}
