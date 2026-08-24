"use client"

import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
} from "@/registry/mayumi/ui/segmented-control"

export function SegmentedControlDemo() {
  return (
    <SegmentedControl defaultValue="list" className="w-72">
      <SegmentedControlList aria-label="视图">
        <SegmentedControlItem value="list">列表</SegmentedControlItem>
        <SegmentedControlItem value="grid">网格</SegmentedControlItem>
        <SegmentedControlItem value="column">分栏</SegmentedControlItem>
      </SegmentedControlList>
      <SegmentedControlPanel value="list" className="text-ui text-fg-secondary">
        列表视图
      </SegmentedControlPanel>
      <SegmentedControlPanel value="grid" className="text-ui text-fg-secondary">
        网格视图
      </SegmentedControlPanel>
      <SegmentedControlPanel value="column" className="text-ui text-fg-secondary">
        分栏视图
      </SegmentedControlPanel>
    </SegmentedControl>
  )
}
