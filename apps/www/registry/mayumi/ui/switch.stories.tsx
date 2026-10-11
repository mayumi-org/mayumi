import type { Meta, StoryObj } from "@storybook/react-vite"
import { Switch } from "./switch"

const meta: Meta<typeof Switch> = { title: "ui/Switch", component: Switch }
export default meta

export const Default: StoryObj<typeof Switch> = {
  render: () => (
    <div className="flex items-center gap-4 p-6">
      <Switch aria-label="关闭态" />
      <Switch aria-label="开启态" defaultChecked />
      <Switch aria-label="禁用" disabled />
      <Switch aria-label="禁用开启" disabled defaultChecked />
    </div>
  ),
}
