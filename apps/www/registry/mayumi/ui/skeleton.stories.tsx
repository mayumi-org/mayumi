import type { Meta, StoryObj } from "@storybook/react-vite"
import { Skeleton } from "./skeleton"

const meta: Meta<typeof Skeleton> = { title: "ui/Skeleton", component: Skeleton }
export default meta

export const Default: StoryObj<typeof Skeleton> = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-card" />
    </div>
  ),
}
