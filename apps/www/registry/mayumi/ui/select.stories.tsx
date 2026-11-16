import type { Meta, StoryObj } from "@storybook/react-vite"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

const meta: Meta<typeof Select> = { title: "ui/Select", component: Select }
export default meta

export const Default: StoryObj<typeof Select> = {
  render: () => (
    <div className="p-16">
      <Select defaultValue="auto">
        <SelectTrigger aria-label="外观">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">自动</SelectItem>
          <SelectItem value="light">浅色</SelectItem>
          <SelectItem value="dark">深色</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}
