import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checklist } from "./checklist"

const meta: Meta<typeof Checklist> = {
  title: "ui/Checklist",
  component: Checklist,
}
export default meta

const items = [
  { id: "design", label: "完成视觉走查" },
  { id: "keyboard", label: "验证键盘操作" },
  { id: "release", label: "准备发布构建" },
]

export const Default: StoryObj<typeof Checklist> = {
  render: () => (
    <div className="w-full max-w-sm p-6">
      <Checklist aria-label="发布前检查事项" items={items} />
    </div>
  ),
}

export const Complete: StoryObj<typeof Checklist> = {
  render: () => (
    <div className="w-full max-w-sm p-6">
      <Checklist
        aria-label="已完成事项"
        items={items}
        defaultValue={items.map((item) => item.id)}
        stackOnComplete
      />
    </div>
  ),
}
