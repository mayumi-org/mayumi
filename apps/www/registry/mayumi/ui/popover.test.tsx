import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

function Demo({
  side,
  onClose,
}: {
  side?: "top" | "bottom" | "left" | "right"
  onClose?: () => void
}) {
  return (
    <Popover>
      <PopoverTrigger>筛选</PopoverTrigger>
      <PopoverContent side={side}>
        <p>按状态过滤</p>
        <PopoverClose onClick={onClose}>完成</PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

describe("Popover", () => {
  it("hides content until the trigger is clicked", async () => {
    render(<Demo />)
    expect(screen.queryByText("按状态过滤")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "筛选" }))
    expect(await screen.findByText("按状态过滤")).toBeInTheDocument()
  })

  it("leaves the rest of the page usable while open", async () => {
    const onOutside = vi.fn()
    render(
      <>
        <button type="button" onClick={onOutside}>
          外面
        </button>
        <Demo />
      </>
    )
    await userEvent.click(screen.getByRole("button", { name: "筛选" }))
    expect(await screen.findByText("按状态过滤")).toBeInTheDocument()
    expect(document.querySelector("[data-slot=popover-backdrop]")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "外面" }))
    expect(onOutside).toHaveBeenCalledOnce()
  })

  it("closes from the close button", async () => {
    const onClose = vi.fn()
    render(<Demo onClose={onClose} />)
    await userEvent.click(screen.getByRole("button", { name: "筛选" }))
    await userEvent.click(await screen.findByRole("button", { name: "完成" }))
    expect(onClose).toHaveBeenCalledOnce()
    expect(screen.queryByText("按状态过滤")).toBeNull()
  })

  it("forwards side to the positioner", async () => {
    render(<Demo side="right" />)
    await userEvent.click(screen.getByRole("button", { name: "筛选" }))
    const panel = await screen.findByText("按状态过滤")
    expect(panel.closest("[data-side]")).toHaveAttribute("data-side", "right")
  })
})
