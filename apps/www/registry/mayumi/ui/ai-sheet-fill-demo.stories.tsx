import type { Meta, StoryObj } from "@storybook/react-vite"

import { AISheetFillDemo } from "@/components/demos/ai-sheet-fill-demo"

const meta: Meta<typeof AISheetFillDemo> = {
  title: "demo/AISheetFill",
  component: AISheetFillDemo,
  args: { autoplay: false },
}
export default meta

type Story = StoryObj<typeof AISheetFillDemo>

export const Default: Story = {
  render: (args) => (
    <div className="flex justify-center bg-[#e9e9ec] p-10">
      <AISheetFillDemo {...args} />
    </div>
  ),
}
