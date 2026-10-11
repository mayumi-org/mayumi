import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ArrowUp,
  AtSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Ellipsis,
  FileArchive,
  Folder,
  GitBranch,
  GitMerge,
  GitPullRequest,
  House,
  Library,
  Mic,
  PanelLeft,
  Phone,
  Plus,
  Search,
  SquarePen,
} from "lucide-react"
import { ActivityBar, ActivityBarItem, ActivityBarSpacer } from "./activity-bar"
import { Avatar, AvatarFallback } from "./avatar"
import { Badge } from "./badge"
import { Button } from "./button"
import {
  CollapsibleSection,
  CollapsibleSectionPanel,
  CollapsibleSectionTrigger,
} from "./collapsible-section"
import { ScrollArea } from "./scroll-area"
import { Separator } from "./separator"
import { Sidebar } from "./sidebar"
import { SidebarNav, SidebarNavItem } from "./sidebar-nav"
import { TitleBar } from "./titlebar"
import { TrafficLights } from "./traffic-lights"
import { Window } from "./window"

const meta: Meta = { title: "demo/AgentChat" }
export default meta

const RAIL = [
  { icon: House, label: "首页", active: true },
  { icon: Library, label: "资料库" },
  { icon: Clock, label: "历史" },
  { icon: AtSign, label: "提及" },
  { icon: Ellipsis, label: "更多" },
]

const PINNED = [
  { title: "创建 make icon skill 路由", status: GitPullRequest },
  { title: "确认分支是否已合并", status: GitMerge },
  { title: "整理订阅管理" },
]

const PROJECTS = [
  {
    name: "supermario",
    threads: [
      { title: "拉取最新代码", status: GitPullRequest },
      { title: "接入 claude-plugin", status: GitPullRequest },
      { title: "按 DESIGN.md 重做 HTML 模板", status: GitPullRequest },
      { title: "转成可预览 HTML" },
    ],
  },
  { name: "ohmyc-plugins", threads: [{ title: "检查会话统计" }] },
  {
    name: "viberss",
    threads: [
      { title: "同步 macOS 构建分支", status: GitPullRequest },
      { title: "生成 Linear 风格设计稿" },
    ],
  },
  {
    name: "claudeui",
    threads: [
      { title: "新增猫咪和蜘蛛侠页面", status: GitBranch },
      { title: "整合 4 个 App 截图制作宣传图", status: GitPullRequest },
    ],
  },
]

/** 侧栏会话行：标题截断，右侧挂状态图标（PR / 合并 / 分支） */
function ThreadItem({
  title,
  status: Status,
  active,
  inset,
}: {
  title: string
  status?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  active?: boolean
  inset?: boolean
}) {
  return (
    <SidebarNavItem
      variant="neutral"
      active={active}
      className={inset ? "pl-7" : undefined}
      trailing={Status ? <Status aria-hidden className="text-accent" /> : null}
    >
      <span className="min-w-0 truncate">{title}</span>
    </SidebarNavItem>
  )
}

function AssistantBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[78%] self-start rounded-card bg-surface-2 px-3 py-2 text-ui leading-relaxed text-fg">
      {children}
    </div>
  )
}

function UserBubble({
  children,
  receipt,
}: {
  children: React.ReactNode
  receipt?: string
}) {
  return (
    <div className="flex max-w-[78%] flex-col items-end gap-1 self-end">
      <div className="rounded-card bg-accent px-3 py-2 text-ui leading-relaxed text-accent-fg">
        {children}
      </div>
      {receipt ? (
        <span className="text-xs text-fg-tertiary">{receipt}</span>
      ) : null}
    </div>
  )
}

function Attachment({ name }: { name: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 self-start rounded-control border border-border bg-surface-2 px-2.5 py-1.5 text-ui text-fg outline-none transition-colors duration-150 ease-out hover:bg-surface-2-hover focus-visible:ring-2 focus-visible:ring-accent/60"
    >
      <FileArchive aria-hidden="true" className="size-3.5 text-fg-secondary" />
      {name}
    </button>
  )
}

export const Conversation: StoryObj = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Window className="h-[680px] w-[1080px] flex-col">
        <TitleBar className="h-10 gap-3">
          <TrafficLights />
          <div className="app-region-no-drag flex items-center gap-0.5">
            <Button variant="ghost" size="icon-sm" aria-label="后退">
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="前进" disabled>
              <ChevronRight aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="切换侧栏">
              <PanelLeft aria-hidden="true" />
            </Button>
          </div>
          <div className="app-region-no-drag ml-auto flex items-center gap-0.5">
            <Button variant="ghost" size="icon-sm" aria-label="更多">
              <Ellipsis aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="检查器">
              <PanelLeft aria-hidden="true" className="size-3.5 -scale-x-100" />
            </Button>
          </div>
        </TitleBar>

        <div className="flex min-h-0 flex-1">
          <ActivityBar aria-label="分区" className="pt-0">
            {RAIL.map(({ icon: Icon, label, active }) => (
              <ActivityBarItem
                key={label}
                label={active ? `${label}，有新动态` : label}
                active={active}
                badge={active ? <Badge /> : undefined}
              >
                <Icon aria-hidden="true" />
              </ActivityBarItem>
            ))}
            <ActivityBarItem label="分支">
              <GitBranch aria-hidden="true" />
            </ActivityBarItem>
            <ActivityBarSpacer />
            <span className="relative">
              <Avatar size="sm" className="bg-traffic-close text-accent-fg">
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <Badge count={2} className="absolute -top-1 -right-1.5" />
            </span>
            <Avatar size="sm" className="mt-1 bg-traffic-zoom text-accent-fg">
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
          </ActivityBar>

          <Sidebar variant="plain" width={240} className="pb-1">
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                className="flex items-center gap-1 rounded-icon px-1 py-1 text-ui font-semibold text-fg outline-none transition-colors duration-150 ease-out hover:bg-fill-hover focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                Codex
                <ChevronDown aria-hidden="true" className="size-3 text-fg-tertiary" />
              </button>
              <div className="flex items-center">
                <Button variant="ghost" size="icon-sm" aria-label="新聊天">
                  <SquarePen aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label="搜索">
                  <Search aria-hidden="true" />
                </Button>
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <SidebarNav aria-label="会话">
                <SidebarNavItem variant="neutral">
                  <SquarePen aria-hidden="true" className="size-4 text-fg-tertiary" />
                  新聊天
                </SidebarNavItem>
                <SidebarNavItem variant="neutral" active>
                  <Avatar size="sm" className="size-4 bg-accent text-accent-fg">
                    <AvatarFallback>m</AvatarFallback>
                  </Avatar>
                  mayumi
                </SidebarNavItem>
              </SidebarNav>

              <div className="pt-4">
                <p className="px-2 pb-1 text-xs text-fg-tertiary">置顶</p>
                <SidebarNav aria-label="置顶">
                  {PINNED.map((t) => (
                    <ThreadItem key={t.title} {...t} />
                  ))}
                </SidebarNav>
              </div>

              <div className="pt-4">
                <p className="px-2 pb-1 text-xs text-fg-tertiary">项目</p>
                {PROJECTS.map((project) => (
                  <CollapsibleSection key={project.name} defaultOpen>
                    <CollapsibleSectionTrigger className="px-2 text-ui text-fg-secondary">
                      <Folder aria-hidden="true" className="size-3.5" />
                      {project.name}
                    </CollapsibleSectionTrigger>
                    <CollapsibleSectionPanel>
                      <SidebarNav aria-label={project.name}>
                        {project.threads.map((t) => (
                          <ThreadItem key={t.title} {...t} inset />
                        ))}
                      </SidebarNav>
                    </CollapsibleSectionPanel>
                  </CollapsibleSection>
                ))}
              </div>
            </ScrollArea>
          </Sidebar>

          {/* 会话区：内容岛 */}
          <div className="mr-1 mb-1 flex min-w-0 flex-1 flex-col overflow-hidden rounded-card border border-border bg-surface">
            <div className="flex h-11 shrink-0 items-center justify-end px-3">
              <Button variant="ghost" size="icon-md" aria-label="语音通话" className="rounded-full">
                <Phone aria-hidden="true" />
              </Button>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <div className="mx-auto flex max-w-[600px] flex-col gap-3 px-6 pb-6">
                <div className="flex h-36 w-64 items-end justify-center self-start overflow-hidden rounded-card border border-border bg-[linear-gradient(160deg,var(--surface-2),var(--fill-active))] pb-3">
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-fg">
                    mayumi
                  </span>
                </div>
                <AssistantBubble>三张独立透明 PNG 包。</AssistantBubble>
                <Attachment name="project-trio-PNG.zip" />

                <UserBubble receipt="Read 22:25">
                  目前为止贴纸的色卡都很有问题，我建议你参考城市系列？或者实际的图片 pick 下色卡
                </UserBubble>

                <AssistantBubble>
                  可以，这次从你认可的城市系列原图里实际取色。我先整理三组色卡，标出来源图、主色和点缀色给你看；选定后再用到这三张成就贴纸上。
                </AssistantBubble>
                <AssistantBubble>
                  <p>从你认可的城市系列总览中实际取了三组颜色，来源和取色点都标在图里：</p>
                  <ul className="mt-1 list-disc pl-5">
                    <li>京都：灰绿、墨黑、琥珀</li>
                    <li>香港：朱红、瓶绿、藏蓝</li>
                    <li>罗马：陶土、杏桃、橄榄</li>
                  </ul>
                  <p className="mt-1">你看这三组颜色关系是否合适？</p>
                </AssistantBubble>
                <div className="h-32 w-44 self-start rounded-card bg-surface-2" />

                <Separator className="py-2">10月10日 15:38</Separator>

                <AssistantBubble>
                  构建已经跑完，三张贴纸都换成了新色卡。要我顺手把预览图也更新到 README 吗？
                </AssistantBubble>
              </div>
            </ScrollArea>

            {/* 输入条：药丸外形，焦点环画在外层 */}
            <div className="shrink-0 px-6 pb-4">
              <div className="mx-auto flex max-w-[600px] items-center gap-1 rounded-full border border-border bg-fill px-1.5 py-1 transition-[border-color,box-shadow] duration-150 ease-out focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/30">
                <Button variant="ghost" size="icon-md" aria-label="添加" className="rounded-full">
                  <Plus aria-hidden="true" className="size-4" />
                </Button>
                <input
                  aria-label="消息"
                  placeholder="Send a message"
                  className="min-w-0 flex-1 bg-transparent px-1 text-ui text-fg outline-none placeholder:text-fg-tertiary"
                />
                <Button variant="ghost" size="icon-md" aria-label="语音输入" className="rounded-full">
                  <Mic aria-hidden="true" />
                </Button>
                <Button variant="primary" size="icon-md" aria-label="发送" className="rounded-full">
                  <ArrowUp aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Window>
    </div>
  ),
}
