import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "./input"

const meta: Meta<typeof Input> = { title: "ui/Input", component: Input }
export default meta

export const Default: StoryObj<typeof Input> = {
  render: () => (
    <div className="w-64 space-y-2 p-6">
      <Input placeholder="名称" />
      <Input placeholder="禁用" disabled />
    </div>
  ),
}
