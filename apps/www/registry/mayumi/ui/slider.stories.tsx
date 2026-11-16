import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slider } from "./slider"

const meta: Meta<typeof Slider> = { title: "ui/Slider", component: Slider }
export default meta

export const Default: StoryObj<typeof Slider> = {
  render: () => (
    <div className="w-64 p-6">
      <Slider aria-label="音量" defaultValue={30} />
    </div>
  ),
}
