import type { Meta, StoryObj } from "@storybook/react-vite"
import { AtSign, Clock, GitBranch, House, Library, Settings } from "lucide-react"
import { useState } from "react"
import { ActivityBar, ActivityBarItem, ActivityBarSpacer } from "./activity-bar"
import { Badge } from "./badge"

const meta: Meta<typeof ActivityBar> = {
  title: "ui/ActivityBar",
  component: ActivityBar,
}
export default meta

type Story = StoryObj<typeof ActivityBar>

const ITEMS = [
  { id: "home", label: "首页", icon: House, badge: <Badge /> },
  { id: "library", label: "资料库", icon: Library },
  { id: "history", label: "历史", icon: Clock },
  { id: "mentions", label: "提及，3 条未读", icon: AtSign, badge: <Badge count={3} /> },
  { id: "branches", label: "分支", icon: GitBranch },
]

function Demo() {
  const [current, setCurrent] = useState("home")
  return (
    <div className="flex h-96 p-6">
      <ActivityBar aria-label="分区" className="rounded-card border border-border">
        {ITEMS.map(({ id, label, icon: Icon, badge }) => (
          <ActivityBarItem
            key={id}
            label={label}
            active={current === id}
            badge={badge}
            onClick={() => setCurrent(id)}
          >
            <Icon aria-hidden="true" />
          </ActivityBarItem>
        ))}
        <ActivityBarSpacer />
        <ActivityBarItem label="设置">
          <Settings aria-hidden="true" />
        </ActivityBarItem>
      </ActivityBar>
    </div>
  )
}

export const Default: Story = { render: () => <Demo /> }
