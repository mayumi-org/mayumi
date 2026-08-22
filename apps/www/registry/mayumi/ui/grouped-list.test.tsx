import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { GroupedList, GroupedListItem } from "./grouped-list"

describe("GroupedList", () => {
  it("interactive rows are buttons and fire onClick", async () => {
    const onClick = vi.fn()
    render(
      <GroupedList>
        <GroupedListItem label="App 管理" onClick={onClick} chevron />
      </GroupedList>
    )
    await userEvent.click(screen.getByRole("button", { name: /App 管理/ }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("static rows are not buttons", () => {
    render(
      <GroupedList>
        <GroupedListItem label="版本" value="1.0.0" />
      </GroupedList>
    )
    expect(screen.queryByRole("button")).toBeNull()
    expect(screen.getByText("版本")).toBeInTheDocument()
  })

  it("renders value and description slots", () => {
    render(
      <GroupedList>
        <GroupedListItem
          label="敏感内容警告"
          description="检测敏感图片与视频"
          value="关闭"
        />
      </GroupedList>
    )
    expect(screen.getByText("关闭")).toBeInTheDocument()
    expect(screen.getByText("检测敏感图片与视频")).toBeInTheDocument()
  })

  it("shows a chevron only when asked", () => {
    const { rerender } = render(
      <GroupedList>
        <GroupedListItem data-testid="row" label="a" />
      </GroupedList>
    )
    expect(screen.getByTestId("row").querySelector("svg")).toBeNull()
    rerender(
      <GroupedList>
        <GroupedListItem data-testid="row" label="a" chevron />
      </GroupedList>
    )
    expect(screen.getByTestId("row").querySelector("svg")).not.toBeNull()
  })

  it("supports disabled on interactive rows", async () => {
    const onClick = vi.fn()
    render(
      <GroupedList>
        <GroupedListItem label="受限项" onClick={onClick} disabled />
      </GroupedList>
    )
    const row = screen.getByRole("button", { name: "受限项" })
    expect(row).toBeDisabled()
    await userEvent.click(row)
    expect(onClick).not.toHaveBeenCalled()
  })
})
