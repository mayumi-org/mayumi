import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { toast, Toaster } from "./toast"

const meta: Meta<typeof Toaster> = { title: "ui/Toast", component: Toaster }
export default meta

export const Default: StoryObj<typeof Toaster> = {
  render: () => (
    <div className="flex gap-2 p-8">
      <Toaster />
      <Button onClick={() => toast("已保存")}>基础通知</Button>
      <Button
        variant="secondary"
        onClick={() => toast("同步完成", { description: "3 个项目已更新" })}
      >
        带描述
      </Button>
    </div>
  ),
}
