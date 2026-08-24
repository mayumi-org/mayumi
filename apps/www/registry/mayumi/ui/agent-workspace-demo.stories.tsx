import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowUp,
  Box,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  History,
  Inbox,
  Layers,
  Paperclip,
  Pencil,
  Plus,
  Radio,
  Search,
  Send,
  Target,
  Users,
} from "lucide-react"
import { Button } from "./button"
import { Kbd } from "./kbd"
import { ScrollArea } from "./scroll-area"
import { Sidebar } from "./sidebar"
import { SidebarNav, SidebarNavItem } from "./sidebar-nav"
import { Textarea } from "./textarea"
import { TitleBar } from "./titlebar"
import { Toolbar } from "./toolbar"
import { TrafficLights } from "./traffic-lights"
import { Window } from "./window"

const meta: Meta = { title: "demo/AgentWorkspace" }
export default meta

function NavSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="pt-4">
      <button
        type="button"
        className="flex w-full items-center gap-1 rounded-icon px-2 py-1 text-xs text-fg-tertiary transition-colors duration-150 ease-out hover:text-fg-secondary"
      >
        {title}
        <ChevronDown aria-hidden="true" className="size-3" />
      </button>
      <SidebarNav aria-label={title}>{children}</SidebarNav>
    </div>
  )
}

const EXAMPLES = [
  {
    icon: Box,
    title: "Create a new project",
    body: "Turn an idea into a well-scoped project",
  },
  {
    icon: Search,
    title: "Research a topic",
    body: "Research a topic across the issue backlog",
  },
  {
    icon: Users,
    title: "Set up new team",
    body: "Create a team that matches how your organization works",
  },
]

export const AgentChat: StoryObj = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Window className="h-[720px] w-[1000px] flex-col">
        {/* 标签栏：红绿灯 + 导航 + 标签页 */}
        <TitleBar className="gap-3 border-b border-border">
          <TrafficLights />
          <div className="app-region-no-drag flex items-center gap-1">
            <Button variant="ghost" size="sm" aria-label="历史">
              <History aria-hidden="true" className="size-3.5" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="后退">
              <ChevronLeft aria-hidden="true" className="size-3.5" />
            </Button>
            <Button variant="ghost" size="sm" aria-label="前进" disabled>
              <ChevronRight aria-hidden="true" className="size-3.5" />
            </Button>
          </div>
          <div className="app-region-no-drag flex items-center gap-1">
            <span className="flex h-7 items-center gap-2 rounded-control bg-surface-raised px-3 text-ui text-fg">
              <Send aria-hidden="true" className="size-3.5 text-fg-secondary" />
              New chat
            </span>
            <Button variant="ghost" size="sm" aria-label="新建标签页">
              <Plus aria-hidden="true" className="size-3.5" />
            </Button>
          </div>
        </TitleBar>

        <div className="flex min-h-0 flex-1">
          {/* plain 侧栏：融进窗口背景，内容区才是岛 */}
          <Sidebar variant="plain" width={250} className="p-1">
            <div className="flex items-center justify-between px-1 py-1">
              <button
                type="button"
                className="flex items-center gap-2 rounded-icon px-1 py-1 text-ui font-medium text-fg transition-colors duration-150 ease-out hover:bg-surface-2/60"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-traffic-minimize text-[10px] text-accent-fg">
                  q
                </span>
                qidanta
                <ChevronDown aria-hidden="true" className="size-3 text-fg-tertiary" />
              </button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" aria-label="搜索">
                  <Search aria-hidden="true" className="size-3.5" />
                </Button>
                <Button variant="secondary" size="sm" aria-label="新建">
                  <Pencil aria-hidden="true" className="size-3.5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <SidebarNav aria-label="主导航">
                <SidebarNavItem>
                  <Inbox aria-hidden="true" className="size-4 text-fg-tertiary" />
                  Inbox
                </SidebarNavItem>
                <SidebarNavItem>
                  <Layers aria-hidden="true" className="size-4 text-fg-tertiary" />
                  Reviews
                </SidebarNavItem>
                <SidebarNavItem>
                  <Target aria-hidden="true" className="size-4 text-fg-tertiary" />
                  My issues
                </SidebarNavItem>
                <SidebarNavItem active className="bg-surface-raised text-fg">
                  <Send aria-hidden="true" className="size-4" />
                  Agent
                </SidebarNavItem>
              </SidebarNav>

              <NavSection title="Workspace">
                <SidebarNavItem>
                  <Radio aria-hidden="true" className="size-4 text-fg-tertiary" />
                  Initiatives
                </SidebarNavItem>
                <SidebarNavItem>
                  <Box aria-hidden="true" className="size-4 text-fg-tertiary" />
                  Projects
                </SidebarNavItem>
                <SidebarNavItem>
                  <Layers aria-hidden="true" className="size-4 text-fg-tertiary" />
                  Views
                </SidebarNavItem>
                <SidebarNavItem>
                  <Ellipsis aria-hidden="true" className="size-4 text-fg-tertiary" />
                  More
                </SidebarNavItem>
              </NavSection>

              <NavSection title="Favorites">
                <SidebarNavItem>
                  <Box aria-hidden="true" className="size-4 text-fg-tertiary" />
                  AIFLOW
                </SidebarNavItem>
                <SidebarNavItem>
                  <Box aria-hidden="true" className="size-4 text-fg-tertiary" />
                  OSS
                </SidebarNavItem>
              </NavSection>

              <NavSection title="Try">
                <SidebarNavItem>
                  <Plus aria-hidden="true" className="size-4 text-fg-tertiary" />
                  Invite people
                </SidebarNavItem>
              </NavSection>
            </ScrollArea>

            <Button variant="ghost" size="sm" aria-label="帮助" className="w-7 rounded-full">
              ?
            </Button>
          </Sidebar>

          {/* 内容岛：圆角 + 边框 + 自身背景 */}
          <div className="flex min-w-0 flex-1 flex-col rounded-card border border-border bg-surface/40 m-1 ml-0 overflow-hidden">
            <Toolbar className="h-11 shrink-0 px-4">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-icon px-1 py-1 text-ui font-medium text-fg transition-colors duration-150 ease-out hover:bg-surface-2/60"
              >
                New chat
                <ChevronDown aria-hidden="true" className="size-3 text-fg-tertiary" />
              </button>
            </Toolbar>

            <ScrollArea className="min-h-0 flex-1">
              <div className="flex min-h-full flex-col items-center justify-center gap-8 px-8 py-10">
                {/* 提示药丸 */}
                <div className="flex items-center gap-3 rounded-full bg-surface-raised px-4 py-2 text-ui text-fg">
                  Linear Agent is now your default view
                  <span className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      Change
                    </Button>
                    <Button variant="secondary" size="sm">
                      Keep
                    </Button>
                  </span>
                </div>

                <div className="w-full max-w-2xl space-y-4">
                  {/* 输入卡 */}
                  <div className="rounded-card border border-border bg-surface-2/40 p-3">
                    <Textarea
                      placeholder="Ask Linear..."
                      rows={3}
                      className="border-0 bg-transparent px-1 focus:ring-0 focus:border-0"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <Button variant="ghost" size="sm">
                        <Box aria-hidden="true" className="size-3.5" />
                        Skills
                        <ChevronDown aria-hidden="true" className="size-3" />
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" aria-label="附件">
                          <Paperclip aria-hidden="true" className="size-3.5" />
                        </Button>
                        <Button variant="secondary" size="sm" aria-label="发送" className="rounded-full">
                          <ArrowUp aria-hidden="true" className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 示例卡片 */}
                  <div className="flex items-center justify-between">
                    <p className="text-ui text-fg-secondary">
                      Get started with some examples
                    </p>
                    <Button variant="ghost" size="sm" aria-label="关闭示例">
                      ✕
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {EXAMPLES.map(({ icon: Icon, title, body }) => (
                      <button
                        key={title}
                        type="button"
                        className="flex flex-col gap-2 rounded-card border border-border bg-surface-2/30 p-4 text-left transition-colors duration-150 ease-out hover:bg-surface-2/60"
                      >
                        <Icon aria-hidden="true" className="size-4 text-fg-tertiary" />
                        <span className="text-ui font-medium text-fg">{title}</span>
                        <span className="text-xs leading-relaxed text-fg-secondary">
                          {body}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="flex h-9 shrink-0 items-center justify-end gap-2 border-t border-border px-4 text-xs text-fg-tertiary">
              <Send aria-hidden="true" className="size-3" />
              Agent
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </div>
          </div>
        </div>
      </Window>
    </div>
  ),
}
