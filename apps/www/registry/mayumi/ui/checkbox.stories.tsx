import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = { title: "ui/Checkbox", component: Checkbox }
export default meta

export const Default: StoryObj<typeof Checkbox> = {
  render: () => (
    <div className="flex items-center gap-4 p-6">
      <Checkbox aria-label="未选" />
      <Checkbox aria-label="已选" defaultChecked />
      <Checkbox aria-label="禁用" disabled />
    </div>
  ),
}
