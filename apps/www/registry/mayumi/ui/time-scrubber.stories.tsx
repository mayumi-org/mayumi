import type { Meta, StoryObj } from "@storybook/react-vite"
import { TimeScrubber } from "./time-scrubber"

const meta: Meta<typeof TimeScrubber> = {
  title: "ui/TimeScrubber",
  component: TimeScrubber,
}
export default meta

export const Default: StoryObj<typeof TimeScrubber> = {
  render: () => (
    <div className="w-full max-w-md p-6">
      <TimeScrubber aria-label="时间" defaultValue={570} />
    </div>
  ),
}

export const TwentyFourHour: StoryObj<typeof TimeScrubber> = {
  render: () => (
    <div className="w-full max-w-md p-6">
      <TimeScrubber aria-label="时间" defaultValue={810} format="24h" step={5} />
    </div>
  ),
}
