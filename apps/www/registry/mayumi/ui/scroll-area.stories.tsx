import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScrollArea } from "./scroll-area"

const meta: Meta<typeof ScrollArea> = { title: "ui/ScrollArea", component: ScrollArea }
export default meta

export const Default: StoryObj<typeof ScrollArea> = {
  render: () => (
    <div className="p-6">
      <ScrollArea className="h-48 w-64 rounded-card border border-border bg-surface">
        <div className="p-3 text-ui text-fg-secondary">
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i} className="py-1">
              列表行 {i + 1}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
}
