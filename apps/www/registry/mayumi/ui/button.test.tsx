import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("draws the bevel highlight inside the border, not as a second one", () => {
    render(<Button variant="secondary">按钮</Button>)
    const el = screen.getByRole("button")
    // 边框 + inset 高光在几何上就是 2px 顶边；能不能读成斜面取决于两条线的对比。
    // 暗色下 --highlight 被置为 transparent，只留一条 hairline（见 theme.css）。
    expect(el).toHaveClass("border")
    expect(el).toHaveClass("shadow-[inset_0_1px_0_0_var(--highlight)]")
  })

  it("renders children and fires onClick", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies the primary variant class", () => {
    render(<Button variant="primary">Go</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-accent")
  })

  it("exposes data-slot and merges custom className", () => {
    render(<Button className="w-full">Go</Button>)
    const el = screen.getByRole("button")
    expect(el).toHaveAttribute("data-slot", "button")
    expect(el).toHaveClass("w-full")
  })

  // 减少动态效果时按下仍要有反馈，只是从缩放降级为压暗
  it("keeps a press affordance under reduced motion", () => {
    render(<Button>Go</Button>)
    const el = screen.getByRole("button")
    expect(el).toHaveClass("motion-safe:active:scale-97")
    expect(el).toHaveClass("motion-reduce:active:brightness-90")
  })
})
