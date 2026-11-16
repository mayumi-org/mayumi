import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ActivityBar, ActivityBarItem, ActivityBarSpacer } from "./activity-bar"

function Demo({ onSelect }: { onSelect?: () => void }) {
  return (
    <ActivityBar aria-label="分区">
      <ActivityBarItem label="首页" active badge={<span>•</span>}>
        <svg aria-hidden="true" />
      </ActivityBarItem>
      <ActivityBarItem label="资料库" onClick={onSelect}>
        <svg aria-hidden="true" />
      </ActivityBarItem>
      <ActivityBarSpacer />
      <ActivityBarItem label="设置">
        <svg aria-hidden="true" />
      </ActivityBarItem>
    </ActivityBar>
  )
}

describe("ActivityBar", () => {
  it("is a vertical toolbar", () => {
    render(<Demo />)
    const bar = screen.getByRole("toolbar", { name: "分区" })
    expect(bar).toHaveAttribute("data-slot", "activity-bar")
    expect(bar).toHaveAttribute("aria-orientation", "vertical")
  })

  it("names icon-only items by label and marks the active one", () => {
    render(<Demo />)
    expect(screen.getByRole("button", { name: "首页" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("button", { name: "资料库" })).not.toHaveAttribute(
      "aria-current"
    )
  })

  it("takes a single tab stop and roves with up/down arrows", async () => {
    render(<Demo />)
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "首页" })).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    expect(screen.getByRole("button", { name: "资料库" })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "设置" })).not.toHaveFocus()
  })

  it("renders the badge in a corner slot", () => {
    render(<Demo />)
    const slot = screen.getByText("•").parentElement
    expect(slot).toHaveAttribute("data-slot", "activity-bar-badge")
    expect(slot).toHaveAttribute("aria-hidden", "true")
  })

  it("shows the label as a tooltip on hover", async () => {
    render(<Demo />)
    await userEvent.hover(screen.getByRole("button", { name: "资料库" }))
    expect(await screen.findByText("资料库")).toBeInTheDocument()
  })

  it("fires onClick", async () => {
    const onSelect = vi.fn()
    render(<Demo onSelect={onSelect} />)
    await userEvent.click(screen.getByRole("button", { name: "资料库" }))
    expect(onSelect).toHaveBeenCalledOnce()
  })
})
