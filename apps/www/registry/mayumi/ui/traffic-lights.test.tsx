import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { TrafficLights } from "./traffic-lights"

describe("TrafficLights", () => {
  it("renders close/minimize/zoom in macOS order", () => {
    render(<TrafficLights />)
    const buttons = screen.getAllByRole("button")
    expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual([
      "Close window",
      "Minimize window",
      "Zoom window",
    ])
  })

  it("fires the matching callback per light", async () => {
    const onClose = vi.fn()
    const onZoom = vi.fn()
    render(<TrafficLights onClose={onClose} onZoom={onZoom} />)
    await userEvent.click(screen.getByRole("button", { name: "Close window" }))
    await userEvent.click(screen.getByRole("button", { name: "Zoom window" }))
    expect(onClose).toHaveBeenCalledOnce()
    expect(onZoom).toHaveBeenCalledOnce()
  })

  it("inset mode renders a spacer with no buttons", () => {
    render(<TrafficLights mode="inset" data-testid="spacer" />)
    expect(screen.queryAllByRole("button")).toHaveLength(0)
    expect(screen.getByTestId("spacer")).toHaveAttribute("aria-hidden", "true")
  })

  it("merges custom className", () => {
    render(<TrafficLights data-testid="tl" className="ml-4" />)
    expect(screen.getByTestId("tl")).toHaveClass("ml-4")
  })
})
