import type { Meta, StoryObj } from "@storybook/react-vite"
import { NumberStepper } from "./number-stepper"

const meta: Meta<typeof NumberStepper> = {
  title: "ui/NumberStepper",
  component: NumberStepper,
}
export default meta

export const Default: StoryObj<typeof NumberStepper> = {
  render: () => (
    <div className="p-6">
      <NumberStepper aria-label="数量" defaultValue={95} />
    </div>
  ),
}

export const Bounded: StoryObj<typeof NumberStepper> = {
  render: () => (
    <div className="p-6">
      <NumberStepper aria-label="数量" defaultValue={99} max={100} draggable={false} />
    </div>
  ),
}
