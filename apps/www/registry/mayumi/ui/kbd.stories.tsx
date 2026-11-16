import type { Meta, StoryObj } from "@storybook/react-vite"
import { Kbd } from "./kbd"

const meta: Meta<typeof Kbd> = { title: "ui/Kbd", component: Kbd }
export default meta

export const Default: StoryObj<typeof Kbd> = {
  render: () => (
    <div className="flex items-center gap-1 p-6 text-ui text-fg-secondary">
      打开命令面板 <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
}
