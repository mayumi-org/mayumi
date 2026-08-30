import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  CollapsibleSection,
  CollapsibleSectionPanel,
  CollapsibleSectionTrigger,
} from "./collapsible-section"

function Demo(props: React.ComponentProps<typeof CollapsibleSection>) {
  return (
    <CollapsibleSection {...props}>
      <CollapsibleSectionTrigger>收藏</CollapsibleSectionTrigger>
      <CollapsibleSectionPanel data-testid="panel">
        项目列表
      </CollapsibleSectionPanel>
    </CollapsibleSection>
  )
}

describe("CollapsibleSection", () => {
  it("starts closed and hides the panel content", () => {
    render(<Demo />)
    expect(screen.getByRole("button", { name: "收藏" })).toHaveAttribute(
      "aria-expanded",
      "false"
    )
    expect(screen.queryByText("项目列表")).toBeNull()
  })

  it("opens on click", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "收藏" }))
    expect(screen.getByText("项目列表")).toBeInTheDocument()
  })

  it("exposes the open state as a styling hook on the trigger", () => {
    render(<Demo defaultOpen />)
    expect(screen.getByRole("button", { name: "收藏" })).toHaveAttribute(
      "data-panel-open"
    )
  })

  it("gates the height animation behind motion-safe", () => {
    render(<Demo defaultOpen />)
    const panel = screen.getByTestId("panel")
    // 高度变化是运动，减少动态效果时应瞬时展开
    expect(panel).toHaveClass("motion-safe:transition-[height]")
    expect(panel).not.toHaveClass("transition-[height]")
  })
})
