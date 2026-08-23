import type { Meta, StoryObj } from "@storybook/react-vite"
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
