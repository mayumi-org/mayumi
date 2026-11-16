"use client"

import { useState } from "react"
import {
  AppWindow,
  Bluetooth,
  Globe,
  Hand,
  Moon,
  PanelLeft,
  Wifi,
  Zap,
} from "lucide-react"

import { Button } from "@/registry/mayumi/ui/button"
import { GroupedList, GroupedListItem } from "@/registry/mayumi/ui/grouped-list"
import { SearchField } from "@/registry/mayumi/ui/search-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/mayumi/ui/select"
import { Sidebar } from "@/registry/mayumi/ui/sidebar"
import {
  SidebarNav,
  SidebarNavIcon,
  SidebarNavItem,
} from "@/registry/mayumi/ui/sidebar-nav"
import { Slider } from "@/registry/mayumi/ui/slider"
import { Switch } from "@/registry/mayumi/ui/switch"
import { TitleBar } from "@/registry/mayumi/ui/titlebar"
import { toast } from "@/registry/mayumi/ui/toast"
import { Toolbar, ToolbarTitle } from "@/registry/mayumi/ui/toolbar"
import { TrafficLights } from "@/registry/mayumi/ui/traffic-lights"
import { Window } from "@/registry/mayumi/ui/window"

// Toaster 已在根布局（app/layout.tsx）mount 一次，这里只调用 toast() 复用它，
// 不要在 demo 里再渲染 <Toaster />。
export function SettingsWindow() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Window className="h-[560px] w-full max-w-[860px] flex-row">
      <Sidebar collapsed={collapsed} width={220} className="h-full">
        <div className="flex h-12 shrink-0 items-center px-1">
          <TrafficLights
            onClose={() => toast("clicked close")}
            onMinimize={() => toast("clicked minimize")}
            onZoom={() => toast("clicked zoom")}
          />
        </div>
        <SearchField placeholder="搜索" />
        <SidebarNav>
          <SidebarNavItem>
            <SidebarNavIcon className="bg-traffic-zoom">
              <Wifi aria-hidden="true" />
            </SidebarNavIcon>
            Wi-Fi
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarNavIcon>
              <Bluetooth aria-hidden="true" />
            </SidebarNavIcon>
            蓝牙
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarNavIcon className="bg-traffic-minimize">
              <Globe aria-hidden="true" />
            </SidebarNavIcon>
            网络
          </SidebarNavItem>
          <SidebarNavItem active>
            <SidebarNavIcon className="bg-traffic-close">
              <Hand aria-hidden="true" />
            </SidebarNavIcon>
            隐私与安全性
          </SidebarNavItem>
        </SidebarNav>
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        <TitleBar>
          <Toolbar>
            <Button
              variant="ghost"
              size="sm"
              className="app-region-no-drag"
              aria-label={collapsed ? "展开侧栏" : "收起侧栏"}
              onClick={() => setCollapsed((value) => !value)}
            >
              <PanelLeft aria-hidden="true" className="size-3.5" />
            </Button>
            <ToolbarTitle className="ml-1">隐私与安全性</ToolbarTitle>
          </Toolbar>
        </TitleBar>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-6">
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
                <SidebarNavIcon>
                  <Zap aria-hidden="true" />
                </SidebarNavIcon>
              }
              label="自动化"
              value="10"
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
              value={
                <Slider
                  aria-label="提示音音量"
                  defaultValue={60}
                  className="w-32"
                />
              }
            />
          </GroupedList>
        </div>
      </div>
    </Window>
  )
}
