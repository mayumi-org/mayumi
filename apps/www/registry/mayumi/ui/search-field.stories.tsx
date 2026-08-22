import type { Meta, StoryObj } from "@storybook/react-vite"
import { SearchField } from "./search-field"

const meta: Meta<typeof SearchField> = {
  title: "ui/SearchField",
  component: SearchField,
}
export default meta

type Story = StoryObj<typeof SearchField>

export const Default: Story = {
  render: () => (
    <div className="w-56 p-6">
      <SearchField placeholder="搜索" />
    </div>
  ),
}
