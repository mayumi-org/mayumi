import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import {
  Island,
  IslandContent,
  IslandFooter,
  IslandHeader,
  IslandTitle,
} from "./island"

const meta: Meta<typeof Island> = { title: "ui/Island", component: Island }
export default meta

export const Default: StoryObj<typeof Island> = {
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-2 bg-surface-2 p-4">
      <Island className="h-56">
        <IslandHeader>
          <IslandTitle>Canvas Island</IslandTitle>
          <Button variant="ghost" size="icon-sm" aria-label="More">
            ···
          </Button>
        </IslandHeader>
        <IslandContent className="p-4 text-ui text-fg-secondary">
          主阅读或研究会话区域。
        </IslandContent>
        <IslandFooter className="text-xs text-fg-tertiary">
          Docked footer
        </IslandFooter>
      </Island>
      <Island variant="sub" className="h-56">
        <IslandHeader>
          <IslandTitle>Sub Surface</IslandTitle>
        </IslandHeader>
        <IslandContent className="p-4 text-ui text-fg-secondary">
          次级托架或内嵌辅助容器。
        </IslandContent>
      </Island>
    </div>
  ),
}
