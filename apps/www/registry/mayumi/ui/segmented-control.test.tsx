import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
} from "./segmented-control"

function Demo() {
  return (
    <SegmentedControl defaultValue="a">
      <SegmentedControlList aria-label="视图">
        <SegmentedControlItem value="a">列表</SegmentedControlItem>
        <SegmentedControlItem value="b">网格</SegmentedControlItem>
      </SegmentedControlList>
      <SegmentedControlPanel value="a">列表内容</SegmentedControlPanel>
      <SegmentedControlPanel value="b">网格内容</SegmentedControlPanel>
    </SegmentedControl>
  )
}

describe("SegmentedControl", () => {
  it("selects the default tab", () => {
    render(<Demo />)
    expect(screen.getByRole("tab", { name: "列表" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByText("列表内容")).toBeInTheDocument()
  })

  it("carries the styling hook on the active tab only", () => {
    render(<Demo />)
    expect(screen.getByRole("tab", { name: "列表" })).toHaveAttribute(
      "data-active"
    )
    expect(screen.getByRole("tab", { name: "网格" })).not.toHaveAttribute(
      "data-active"
    )
  })

  it("switches panel on click", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("tab", { name: "网格" }))
    expect(screen.getByText("网格内容")).toBeInTheDocument()
    expect(screen.queryByText("列表内容")).toBeNull()
  })

  it("supports keyboard navigation", async () => {
    render(<Demo />)
    screen.getByRole("tab", { name: "列表" }).focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "网格" })).toHaveFocus()
  })
})
