import type { Meta, StoryObj } from "@storybook/react-vite"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

const meta: Meta<typeof Avatar> = { title: "ui/Avatar", component: Avatar }
export default meta

export const Sizes: StoryObj<typeof Avatar> = {
  render: () => (
    <div className="flex items-center gap-4 p-6">
      <Avatar size="sm">
        <AvatarFallback>蒋</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/jiangweixian.png" alt="蒋威" />
        <AvatarFallback>蒋</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>MY</AvatarFallback>
      </Avatar>
    </div>
  ),
}
