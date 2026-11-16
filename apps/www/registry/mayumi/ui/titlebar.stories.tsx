import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { TitleBar } from "./titlebar"
import { Toolbar, ToolbarTitle } from "./toolbar"
import { Window } from "./window"

const meta: Meta<typeof TitleBar> = {
  title: "ui/TitleBar",
  component: TitleBar,
}
export default meta

type Story = StoryObj<typeof TitleBar>

export const WithToolbar: Story = {
  render: () => (
    <div className="p-8">
      <Window className="h-40 w-[560px]">
        <TitleBar>
          <Toolbar>
            <Button variant="ghost" size="sm" className="app-region-no-drag" aria-label="返回">
              ←
            </Button>
            <Button variant="ghost" size="sm" className="app-region-no-drag" aria-label="前进">
              →
            </Button>
            <ToolbarTitle className="ml-2">隐私与安全性</ToolbarTitle>
          </Toolbar>
          <Button variant="secondary" size="sm" className="app-region-no-drag">
            高级…
          </Button>
        </TitleBar>
      </Window>
    </div>
  ),
}
