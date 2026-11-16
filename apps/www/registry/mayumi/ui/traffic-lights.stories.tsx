import type { Meta, StoryObj } from "@storybook/react-vite"
import { TitleBar } from "./titlebar"
import { TrafficLights } from "./traffic-lights"
import { Window } from "./window"

const meta: Meta<typeof TrafficLights> = {
  title: "ui/TrafficLights",
  component: TrafficLights,
}
export default meta

type Story = StoryObj<typeof TrafficLights>

export const Controls: Story = {
  render: () => (
    <div className="p-8">
      <Window className="w-[360px]">
        <TitleBar>
          <TrafficLights
            onClose={() => console.log("close")}
            onMinimize={() => console.log("minimize")}
            onZoom={() => console.log("zoom")}
          />
        </TitleBar>
      </Window>
    </div>
  ),
}

export const NativeInset: Story = {
  render: () => (
    <div className="p-8">
      <Window className="w-[360px]">
        <TitleBar>
          <TrafficLights mode="inset" />
          <span className="text-fg-secondary">原生红绿灯占位（overlay 模式）</span>
        </TitleBar>
      </Window>
    </div>
  ),
}
