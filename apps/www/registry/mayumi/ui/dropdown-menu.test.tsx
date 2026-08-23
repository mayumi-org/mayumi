import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

function Demo({ onSelect }: { onSelect?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>操作</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onSelect}>重命名</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>删除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe("DropdownMenu", () => {
  it("opens on trigger click and lists items", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "操作" }))
    expect(await screen.findAllByRole("menuitem")).toHaveLength(2)
  })

  it("fires item onClick", async () => {
    const onSelect = vi.fn()
    render(<Demo onSelect={onSelect} />)
    await userEvent.click(screen.getByRole("button", { name: "操作" }))
    await userEvent.click(await screen.findByRole("menuitem", { name: "重命名" }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it("renders a separator", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "操作" }))
    expect(await screen.findByRole("separator")).toBeInTheDocument()
  })
})
