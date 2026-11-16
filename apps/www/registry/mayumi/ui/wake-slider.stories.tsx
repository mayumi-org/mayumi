import type { Meta, StoryObj } from "@storybook/react-vite"
import { WakeSlider } from "./wake-slider"

const meta: Meta<typeof WakeSlider> = {
  title: "ui/WakeSlider",
  component: WakeSlider,
}
export default meta

export const Default: StoryObj<typeof WakeSlider> = {
  render: () => (
    <div className="w-full max-w-md p-6">
      <WakeSlider aria-label="音量" defaultValue={50} />
    </div>
  ),
}

export const WithoutWake: StoryObj<typeof WakeSlider> = {
  render: () => (
    <div className="w-full max-w-md p-6">
      <WakeSlider aria-label="音量" defaultValue={50} wake={0} />
    </div>
  ),
}
