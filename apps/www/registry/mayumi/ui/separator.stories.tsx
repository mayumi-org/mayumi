import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "./separator"

const meta: Meta<typeof Separator> = {
  title: "ui/Separator",
  component: Separator,
}
export default meta

type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3 p-6 text-ui text-fg">
      <p>通用</p>
      <Separator />
      <p>外观</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3 p-6 text-ui text-fg-secondary">
      <span>剪切</span>
      <Separator orientation="vertical" />
      <span>复制</span>
      <Separator orientation="vertical" />
      <span>粘贴</span>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-96 p-6">
      <Separator>10月10日 15:38</Separator>
    </div>
  ),
}
