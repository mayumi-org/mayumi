import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
import { Button } from "./button"
import { GroupedList, GroupedListItem } from "./grouped-list"
import { ScrollArea } from "./scroll-area"
import { SearchField } from "./search-field"
import { Sidebar } from "./sidebar"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"
import { Switch } from "./switch"
import { TitleBar } from "./titlebar"
import { Toolbar, ToolbarTitle } from "./toolbar"
import { TrafficLights } from "./traffic-lights"
import { Window } from "./window"

const meta: Meta = { title: "demo/PrivacySettings" }
export default meta

const APPS: { name: string; tint: string; on: boolean }[] = [
  { name: "微信", tint: "bg-traffic-zoom", on: true },
  { name: "Bartender 5", tint: "bg-fg", on: true },
  { name: "ChromeRemoteDesktopHost", tint: "bg-traffic-close", on: true },
  { name: "DockDoor", tint: "bg-traffic-minimize", on: false },
  { name: "iShot", tint: "bg-accent", on: false },
  { name: "Kap", tint: "bg-surface-2", on: true },
  { name: "Shottr", tint: "bg-traffic-close", on: true },
]

function ListFooter() {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <Button variant="ghost" size="sm" aria-label="添加">
        <Plus aria-hidden="true" className="size-3.5" />
      </Button>
      <Button variant="ghost" size="sm" aria-label="移除">
        <Minus aria-hidden="true" className="size-3.5" />
      </Button>
    </div>
  )
}

export const ScreenRecording: StoryObj = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Window className="h-[640px] w-[900px] flex-row">
        <Sidebar floating width={230}>
          <div className="flex h-10 shrink-0 items-center px-1">
            <TrafficLights />
          </div>
          <SearchField placeholder="搜索" />
          {/* 账户区：头像行用图标槽放圆形底座近似（Avatar 组件是后续候选） */}
          <div className="space-y-0.5 py-1">
            <SidebarNavItem>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs text-accent-fg">
                蒋
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-fg">蒋威</span>
                <span className="truncate text-xs text-fg-tertiary">
                  Apple 账户
                </span>
              </span>
            </SidebarNavItem>
            <SidebarNavItem>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-traffic-minimize text-xs text-accent-fg">
                家
              </span>
              家人共享
            </SidebarNavItem>
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <SidebarNav>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-accent" />
                Wi-Fi
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-accent" />
                蓝牙
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-traffic-zoom" />
                网络
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-traffic-minimize" />
                能耗
              </SidebarNavItem>
              <SidebarNavItem active>
                <SidebarNavIcon className="bg-traffic-close" />
                隐私与安全性
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-surface-raised" />
                通用
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-accent" />
                辅助功能
              </SidebarNavItem>
            </SidebarNav>
          </ScrollArea>
        </Sidebar>
        <div className="flex min-w-0 flex-1 flex-col">
          <TitleBar>
            <Toolbar>
              <Button
                variant="ghost"
                size="sm"
                className="app-region-no-drag"
                aria-label="返回"
              >
                <ChevronLeft aria-hidden="true" className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="app-region-no-drag"
                aria-label="前进"
                disabled
              >
                <ChevronRight aria-hidden="true" className="size-3.5" />
              </Button>
              <ToolbarTitle className="ml-1">录屏与系统录音</ToolbarTitle>
            </Toolbar>
          </TitleBar>
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-6 px-6 pb-8">
              <section className="space-y-1">
                <h2 className="text-ui leading-tight font-semibold text-fg">
                  录屏与系统录音
                </h2>
                <p className="text-xs leading-relaxed text-fg-secondary">
                  即使正在使用其他应用程序，也允许下面的应用程序录制屏幕内容和音频。
                </p>
              </section>
              <GroupedList>
                {APPS.map((app) => (
                  <GroupedListItem
                    key={app.name}
                    icon={
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-icon text-[10px] text-accent-fg ${app.tint}`}
                      >
                        {app.name.slice(0, 1)}
                      </span>
                    }
                    label={app.name}
                    value={
                      <Switch aria-label={`允许 ${app.name}`} defaultChecked={app.on} />
                    }
                  />
                ))}
                <ListFooter />
              </GroupedList>
              <section className="space-y-1">
                <h2 className="text-ui leading-tight font-semibold text-fg">
                  仅系统录音
                </h2>
                <p className="text-xs leading-relaxed text-fg-secondary">
                  允许下面的应用程序访问和录制系统音频。
                </p>
              </section>
              <GroupedList>
                <div className="py-2.5 text-center text-ui text-fg-tertiary">
                  无项目
                </div>
                <ListFooter />
              </GroupedList>
            </div>
          </ScrollArea>
        </div>
      </Window>
    </div>
  ),
}
