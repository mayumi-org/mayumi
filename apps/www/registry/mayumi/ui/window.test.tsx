import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Window, WindowBody } from "./window"

describe("Window", () => {
  it("renders children in a framed window", () => {
    render(
      <Window>
        <WindowBody>content</WindowBody>
      </Window>
    )
    const win = screen.getByText("content").closest('[data-slot="window"]')
    expect(win).not.toBeNull()
    expect(win).toHaveClass("rounded-window")
  })

  it("applies the vibrancy material only when asked", () => {
    const { rerender } = render(<Window data-testid="w" />)
    expect(screen.getByTestId("w")).toHaveClass("bg-background")
    rerender(<Window data-testid="w" vibrancy />)
    expect(screen.getByTestId("w")).toHaveClass("mayumi-vibrancy")
    expect(screen.getByTestId("w")).not.toHaveClass("bg-background")
  })

  it("merges custom className", () => {
    render(<Window data-testid="w" className="flex-row" />)
    expect(screen.getByTestId("w")).toHaveClass("flex-row")
  })
})
