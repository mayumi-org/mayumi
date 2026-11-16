import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu"

function Demo({ onSelect }: { onSelect?: () => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>这条记录</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onSelect}>重命名</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>删除</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

describe("ContextMenu", () => {
  it("stays closed on a primary click", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByText("这条记录"))
    expect(screen.queryByRole("menuitem")).toBeNull()
  })

  it("opens on right click and lists items", async () => {
    render(<Demo />)
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("这条记录"),
    })
    expect(await screen.findAllByRole("menuitem")).toHaveLength(2)
  })

  it("fires item onClick", async () => {
    const onSelect = vi.fn()
    render(<Demo onSelect={onSelect} />)
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("这条记录"),
    })
    await userEvent.click(await screen.findByRole("menuitem", { name: "重命名" }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it("renders a separator", async () => {
    render(<Demo />)
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("这条记录"),
    })
    expect(await screen.findByRole("separator")).toBeInTheDocument()
  })
})
