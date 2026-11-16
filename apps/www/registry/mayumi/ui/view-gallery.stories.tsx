import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"

import { ViewGallery, type ViewGalleryItem } from "./view-gallery"

const meta: Meta<typeof ViewGallery> = {
  title: "ui/ViewGallery",
  component: ViewGallery,
}
export default meta

type Story = StoryObj<typeof ViewGallery>

/** 演示用的邮件列表密度预览卡：纯骨架块，不依赖真实数据 */
function MailListPreview({ density }: { density: "compact" | "cozy" | "spacious" }) {
  const rows = { compact: 6, cozy: 4, spacious: 3 }[density]
  const padding = { compact: "py-1", cozy: "py-2", spacious: "py-3.5" }[density]
  return (
    <div className="w-full rounded-card border border-border bg-surface p-3 text-left shadow-[var(--shadow-raised)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-2 w-16 rounded-full bg-fill-active" />
        <div className="h-2 w-8 rounded-full bg-fill" />
      </div>
      <div className="flex flex-col divide-y divide-border">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={cn("flex items-center gap-2.5", padding)}>
            <div className="size-6 shrink-0 rounded-full bg-fill-active" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="h-1.5 w-3/4 rounded-full bg-fill-active" />
              <div className="h-1.5 w-1/2 rounded-full bg-fill" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const densityItems: ViewGalleryItem[] = [
  {
    id: "compact",
    name: "Compact",
    description: "Scan the whole inbox at a glance.",
    preview: <MailListPreview density="compact" />,
  },
  {
    id: "cozy",
    name: "Cozy",
    description: "A balanced default for every day.",
    preview: <MailListPreview density="cozy" />,
  },
  {
    id: "spacious",
    name: "Spacious",
    description: "More breathing room per conversation.",
    preview: <MailListPreview density="spacious" />,
  },
]

export const Default: Story = {
  render: function Render() {
    const [applied, setApplied] = useState("cozy")
    return (
      <div className="w-[640px] max-w-full p-6">
        <ViewGallery
          items={densityItems}
          appliedId={applied}
          onApply={async (id) => {
            await new Promise((resolve) => setTimeout(resolve, 600))
            setApplied(id)
          }}
        />
      </div>
    )
  },
}

export const ReadOnly: Story = {
  render: () => (
    <div className="w-[640px] max-w-full p-6">
      <ViewGallery items={densityItems} />
    </div>
  ),
}
