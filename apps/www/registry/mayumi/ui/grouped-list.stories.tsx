import type { Meta, StoryObj } from "@storybook/react-vite"
import { GroupedList, GroupedListItem } from "./grouped-list"
import { SidebarNavIcon } from "./sidebar-nav"

const meta: Meta<typeof GroupedList> = {
  title: "ui/GroupedList",
  component: GroupedList,
}
export default meta

type Story = StoryObj<typeof GroupedList>

export const Settings: Story = {
  render: () => (
    <div className="w-[480px] space-y-4 p-6">
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
        />
      </GroupedList>
    </div>
  ),
}
