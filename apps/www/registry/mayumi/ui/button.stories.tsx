import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "ui/Button",
  component: Button,
  args: { children: "Button" },
}
export default meta

type Story = StoryObj<typeof Button>

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 p-6">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
      <Button {...args} disabled>
        Disabled
      </Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 p-6">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
}
