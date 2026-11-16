import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Accessibility,
  BatteryCharging,
  Bluetooth,
  ChevronLeft,
  ChevronRight,
  Globe,
  Hand,
  Minus,
  Plus,
  Settings,
  Wifi,
} from "lucide-react"
import { Avatar, AvatarFallback } from "./avatar"
import { Button } from "./button"
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from "./empty-state"
import { GroupedList, GroupedListItem } from "./grouped-list"
import { ListToolbar, ListToolbarButton } from "./list-toolbar"
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

// tint 自带前景色，避免浅色底座配白字导致首字母看不清
const APPS: { name: string; tint: string; on: boolean }[] = [
  { name: "微信", tint: "bg-traffic-zoom text-accent-fg", on: true },
  { name: "Bartender 5", tint: "bg-fg text-background", on: true },
  { name: "ChromeRemoteDesktopHost", tint: "bg-traffic-close text-accent-fg", on: true },
  { name: "DockDoor", tint: "bg-traffic-minimize text-accent-fg", on: false },
  { name: "iShot", tint: "bg-accent text-accent-fg", on: false },
  { name: "Kap", tint: "bg-surface-2 text-fg", on: true },
  { name: "Shottr", tint: "bg-traffic-close text-accent-fg", on: true },
]

function ListFooter({ label }: { label: string }) {
  return (
    <ListToolbar aria-label={label}>
      <ListToolbarButton aria-label="添加">
        <Plus aria-hidden="true" />
      </ListToolbarButton>
      <ListToolbarButton aria-label="移除">
        <Minus aria-hidden="true" />
      </ListToolbarButton>
    </ListToolbar>
  )
}

export const ScreenRecording: StoryObj = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Window className="h-[640px] w-[900px] flex-row">
        <Sidebar variant="floating" width={230}>
          <div className="flex h-10 shrink-0 items-center px-1">
            <TrafficLights />
          </div>
          <SearchField placeholder="搜索" />
          {/* 账户区 */}
          <div className="space-y-0.5 py-1">
            <SidebarNavItem>
              <Avatar className="bg-accent text-accent-fg">
                <AvatarFallback>蒋</AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-fg">蒋威</span>
                <span className="truncate text-xs text-fg-tertiary">
                  Apple 账户
                </span>
              </span>
            </SidebarNavItem>
            <SidebarNavItem>
              <Avatar className="bg-traffic-minimize text-accent-fg">
                <AvatarFallback>家</AvatarFallback>
              </Avatar>
              家人共享
            </SidebarNavItem>
          </div>
          <ScrollArea className="min-h-0 flex-1">
            <SidebarNav>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-accent">
                  <Wifi aria-hidden="true" />
                </SidebarNavIcon>
                Wi-Fi
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-accent">
                  <Bluetooth aria-hidden="true" />
                </SidebarNavIcon>
                蓝牙
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-traffic-zoom">
                  <Globe aria-hidden="true" />
                </SidebarNavIcon>
                网络
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-traffic-minimize">
                  <BatteryCharging aria-hidden="true" />
                </SidebarNavIcon>
                能耗
              </SidebarNavItem>
              <SidebarNavItem active>
                <SidebarNavIcon className="bg-traffic-close">
                  <Hand aria-hidden="true" />
                </SidebarNavIcon>
                隐私与安全性
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-surface-raised text-fg">
                  <Settings aria-hidden="true" />
                </SidebarNavIcon>
                通用
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-accent">
                  <Accessibility aria-hidden="true" />
                </SidebarNavIcon>
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
                        className={`flex size-6 shrink-0 items-center justify-center rounded-icon text-[10px] ${app.tint}`}
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
                <ListFooter label="屏幕与系统录音列表操作" />
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
                <EmptyState className="py-6">
                  <EmptyStateTitle>无项目</EmptyStateTitle>
                  <EmptyStateDescription>
                    还没有 App 请求过系统录音权限。
                  </EmptyStateDescription>
                </EmptyState>
                <ListFooter label="仅系统录音列表操作" />
              </GroupedList>
            </div>
          </ScrollArea>
        </div>
      </Window>
    </div>
  ),
}
