import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  ListToolbar,
  ListToolbarButton,
  ListToolbarSeparator,
} from "./list-toolbar"

function Demo() {
  return (
    <ListToolbar aria-label="列表操作">
      <ListToolbarButton aria-label="添加">+</ListToolbarButton>
      <ListToolbarButton aria-label="移除">−</ListToolbarButton>
      <ListToolbarSeparator />
      <ListToolbarButton aria-label="更多">…</ListToolbarButton>
    </ListToolbar>
  )
}

describe("ListToolbar", () => {
  it("exposes a toolbar role so the buttons read as one group", () => {
    render(<Demo />)
    expect(screen.getByRole("toolbar", { name: "列表操作" })).toBeInTheDocument()
  })

  it("takes a single tab stop and roves with arrow keys", async () => {
    render(<Demo />)
    await userEvent.tab()
    const add = screen.getByRole("button", { name: "添加" })
    expect(add).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("button", { name: "移除" })).toHaveFocus()
    // 整条工具栏只占一个 Tab 站，Tab 应该离开而不是走到下一个按钮
    await userEvent.tab()
    expect(screen.getByRole("button", { name: "更多" })).not.toHaveFocus()
  })

  it("fires onClick", async () => {
    const onClick = vi.fn()
    render(
      <ListToolbar aria-label="列表操作">
        <ListToolbarButton aria-label="添加" onClick={onClick}>
          +
        </ListToolbarButton>
      </ListToolbar>
    )
    await userEvent.click(screen.getByRole("button", { name: "添加" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not fire when disabled", async () => {
    const onClick = vi.fn()
    render(
      <ListToolbar aria-label="列表操作">
        <ListToolbarButton aria-label="移除" onClick={onClick} disabled>
          −
        </ListToolbarButton>
      </ListToolbar>
    )
    await userEvent.click(screen.getByRole("button", { name: "移除" }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
