import type { Meta, StoryObj } from "@storybook/react-vite"
import { Textarea } from "./textarea"

const meta: Meta<typeof Textarea> = { title: "ui/Textarea", component: Textarea }
export default meta

export const Default: StoryObj<typeof Textarea> = {
  render: () => (
    <div className="w-80 space-y-2 p-6">
      <Textarea placeholder="说点什么…" rows={3} />
      <Textarea placeholder="禁用" rows={2} disabled />
    </div>
  ),
}
