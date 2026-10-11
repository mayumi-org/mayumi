import type { Meta, StoryObj } from "@storybook/react-vite"

import { ArrowUp, Plus } from "lucide-react"

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

export const Tactile: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-16">
      <Button variant="tactile" size="sm">
        Small
      </Button>
      <Button variant="tactile" size="md">
        take action
      </Button>
      <Button variant="tactile" size="lg">
        take action
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

export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-6">
      <Button variant="ghost" size="icon-sm" aria-label="添加">
        <Plus aria-hidden="true" />
      </Button>
      <Button variant="ghost" size="icon-md" aria-label="添加">
        <Plus aria-hidden="true" />
      </Button>
      <Button variant="secondary" size="icon-lg" aria-label="添加">
        <Plus aria-hidden="true" />
      </Button>
      <Button variant="primary" size="icon-md" aria-label="发送" className="rounded-full">
        <ArrowUp aria-hidden="true" />
      </Button>
      <Button variant="tactile" size="icon-md" aria-label="发送" className="ml-4">
        <ArrowUp aria-hidden="true" />
      </Button>
    </div>
  ),
}
