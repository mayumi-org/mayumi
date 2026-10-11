import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bento, BentoCell } from "./bento"

const meta: Meta<typeof Bento> = { title: "ui/Bento", component: Bento }
export default meta

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-20 items-center justify-center text-ui text-fg-tertiary">
      {label}
    </div>
  )
}

export const Tiles: StoryObj<typeof Bento> = {
  render: () => (
    <div className="w-[560px] p-6">
      <Bento className="grid-cols-3">
        <BentoCell className="col-span-2 row-span-2">
          <Placeholder label="2 × 2" />
        </BentoCell>
        <BentoCell>
          <Placeholder label="1" />
        </BentoCell>
        <BentoCell className="row-span-2">
          <Placeholder label="1 × 2" />
        </BentoCell>
        <BentoCell>
          <Placeholder label="2" />
        </BentoCell>
        <BentoCell className="col-span-2">
          <Placeholder label="2 × 1" />
        </BentoCell>
      </Bento>
    </div>
  ),
}

export const Divided: StoryObj<typeof Bento> = {
  render: () => (
    <div className="w-[560px] p-6">
      <Bento divided className="grid-cols-4 auto-rows-[72px]">
        <BentoCell className="col-span-2 row-span-2">
          <Placeholder label="2 × 2" />
        </BentoCell>
        <BentoCell />
        <BentoCell />
        <BentoCell className="col-span-2" />
        <BentoCell />
        <BentoCell />
        <BentoCell />
        <BentoCell />
      </Bento>
    </div>
  ),
}
