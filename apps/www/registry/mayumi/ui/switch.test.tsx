import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Switch } from "./switch"

describe("Switch", () => {
  it("toggles on click and reports state", async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="启用" onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole("switch", { name: "启用" })
    expect(el).not.toBeChecked()
    await userEvent.click(el)
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("renders checked state", () => {
    render(<Switch aria-label="启用" defaultChecked />)
    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("respects disabled", async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="启用" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole("switch"))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  // 减少动态效果时旋钮直接落位，位移动画必须走 motion-safe 门控
  it("gates the thumb travel behind motion-safe", () => {
    const { container } = render(<Switch aria-label="启用" />)
    const thumb = container.querySelector('[data-slot="switch-thumb"]')
    expect(thumb).not.toBeNull()
    expect(thumb?.className).toContain("motion-safe:transition-transform")
    expect(thumb?.className).not.toMatch(/(^|\s)transition-transform/)
  })
})
