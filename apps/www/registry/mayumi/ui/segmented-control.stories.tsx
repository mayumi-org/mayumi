import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  CalendarDays,
  FileText,
  Globe,
  House,
  Settings,
  UserRound,
} from "lucide-react"
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
} from "./segmented-control"

const meta: Meta<typeof SegmentedControl> = {
  title: "ui/SegmentedControl",
  component: SegmentedControl,
}
export default meta

export const Default: StoryObj<typeof SegmentedControl> = {
  render: () => (
    <div className="w-72 p-6">
      <SegmentedControl defaultValue="list">
        <SegmentedControlList aria-label="视图切换">
          <SegmentedControlItem value="list">列表</SegmentedControlItem>
          <SegmentedControlItem value="grid">网格</SegmentedControlItem>
          <SegmentedControlItem value="column">分栏</SegmentedControlItem>
        </SegmentedControlList>
        <SegmentedControlPanel value="list" className="text-ui text-fg-secondary">
          列表视图内容
        </SegmentedControlPanel>
        <SegmentedControlPanel value="grid" className="text-ui text-fg-secondary">
          网格视图内容
        </SegmentedControlPanel>
        <SegmentedControlPanel value="column" className="text-ui text-fg-secondary">
          分栏视图内容
        </SegmentedControlPanel>
      </SegmentedControl>
    </div>
  ),
}

const ICON_TABS = [
  { value: "home", label: "首页", icon: House },
  { value: "calendar", label: "日历", icon: CalendarDays },
  { value: "globe", label: "网络", icon: Globe },
  { value: "docs", label: "文稿", icon: FileText },
  { value: "profile", label: "我的", icon: UserRound },
  { value: "settings", label: "设置", icon: Settings },
]

export const Icon: StoryObj<typeof SegmentedControl> = {
  render: () => (
    <div className="p-6">
      <SegmentedControl defaultValue="home">
        <SegmentedControlList aria-label="导航" className="self-start rounded-full">
          {ICON_TABS.map(({ value, label, icon: Icon }) => (
            <SegmentedControlItem key={value} size="icon" value={value} aria-label={label}>
              <Icon aria-hidden="true" />
            </SegmentedControlItem>
          ))}
        </SegmentedControlList>
      </SegmentedControl>
    </div>
  ),
}
