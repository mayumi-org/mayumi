import type { Meta, StoryObj } from "@storybook/react-vite"
import { Window, WindowBody } from "./window"

const meta: Meta<typeof Window> = {
  title: "ui/Window",
  component: Window,
}
export default meta

type Story = StoryObj<typeof Window>

export const Solid: Story = {
  render: () => (
    <div className="p-8">
      <Window className="h-80 w-[560px]">
        <WindowBody>
          <div className="flex flex-1 items-center justify-center text-fg-secondary">
            solid window
          </div>
        </WindowBody>
      </Window>
    </div>
  ),
}

export const Vibrancy: Story = {
  render: () => (
    <div className="bg-[url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1200')] bg-cover p-8">
      <Window vibrancy className="h-80 w-[560px]">
        <WindowBody>
          <div className="flex flex-1 items-center justify-center text-fg-secondary">
            vibrancy window
          </div>
        </WindowBody>
      </Window>
    </div>
  ),
}
