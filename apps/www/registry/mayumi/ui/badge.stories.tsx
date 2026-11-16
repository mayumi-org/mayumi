import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "./avatar"
import { Badge } from "./badge"

const meta: Meta<typeof Badge> = {
  title: "ui/Badge",
  component: Badge,
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-6">
      <Badge count={3} />
      <Badge count={128} />
      <Badge tone="accent">新</Badge>
      <Badge tone="neutral" count={12} />
      <Badge />
      <Badge tone="accent" />
    </div>
  ),
}

export const Anchored: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-6">
      <span className="relative inline-flex">
        <Bell aria-hidden="true" className="size-5 text-fg-secondary" />
        <Badge className="absolute -top-1 -right-1.5" count={4} />
      </span>
      <span className="relative inline-flex">
        <Avatar>
          <AvatarFallback>JW</AvatarFallback>
        </Avatar>
        <Badge className="absolute top-0 right-0" />
      </span>
    </div>
  ),
}
