import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Tabs, TabsList, TabsPanel, TabsTab } from "./tabs"

function Demo() {
  return (
    <Tabs defaultValue="a">
      <TabsList aria-label="设置分区">
        <TabsTab value="a">通用</TabsTab>
        <TabsTab value="b">隐私</TabsTab>
      </TabsList>
      <TabsPanel value="a">通用内容</TabsPanel>
      <TabsPanel value="b">隐私内容</TabsPanel>
    </Tabs>
  )
}

describe("Tabs", () => {
  it("selects the default tab", () => {
    render(<Demo />)
    expect(screen.getByRole("tab", { name: "通用" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByText("通用内容")).toBeInTheDocument()
  })

  it("switches panel on click", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("tab", { name: "隐私" }))
    expect(screen.getByText("隐私内容")).toBeInTheDocument()
    expect(screen.queryByText("通用内容")).toBeNull()
  })

  it("supports keyboard navigation", async () => {
    render(<Demo />)
    screen.getByRole("tab", { name: "通用" }).focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "隐私" })).toHaveFocus()
  })

  it("gates the indicator travel behind motion-safe", () => {
    render(<Demo />)
    const indicator = screen
      .getByRole("tablist")
      .querySelector('[data-slot="tabs-indicator"]')
    // 指示条滑动是运动，减少动态效果时应直接落位
    expect(indicator).toHaveClass("motion-safe:transition-[translate,width]")
    expect(indicator).not.toHaveClass("transition-[translate,width]")
  })
})
