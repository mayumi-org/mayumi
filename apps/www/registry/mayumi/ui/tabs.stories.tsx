import type { Meta, StoryObj } from "@storybook/react-vite"
import { Tabs, TabsList, TabsPanel, TabsTab } from "./tabs"

const meta: Meta<typeof Tabs> = { title: "ui/Tabs", component: Tabs }
export default meta

export const Default: StoryObj<typeof Tabs> = {
  render: () => (
    <div className="w-96 p-6">
      <Tabs defaultValue="general">
        <TabsList aria-label="设置分区">
          <TabsTab value="general">通用</TabsTab>
          <TabsTab value="privacy">隐私</TabsTab>
          <TabsTab value="advanced">高级</TabsTab>
        </TabsList>
        <TabsPanel value="general" className="text-ui text-fg-secondary">
          外观、语言与地区。
        </TabsPanel>
        <TabsPanel value="privacy" className="text-ui text-fg-secondary">
          定位服务、屏幕录制与麦克风。
        </TabsPanel>
        <TabsPanel value="advanced" className="text-ui text-fg-secondary">
          实验性功能与诊断数据。
        </TabsPanel>
      </Tabs>
    </div>
  ),
}
