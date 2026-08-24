import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Sidebar } from "./sidebar"

describe("Sidebar", () => {
  it("renders children on the vibrancy material", () => {
    render(<Sidebar data-testid="sb">nav</Sidebar>)
    const el = screen.getByTestId("sb")
    expect(el).toHaveClass("mayumi-vibrancy")
    expect(screen.getByText("nav")).toBeInTheDocument()
  })

  it("hides from the a11y tree when collapsed", () => {
    render(
      <Sidebar data-testid="sb" collapsed>
        nav
      </Sidebar>
    )
    const el = screen.getByTestId("sb")
    expect(el).toHaveAttribute("data-collapsed")
    expect(el).toHaveAttribute("aria-hidden", "true")
    expect(el).toHaveAttribute("inert")
  })

  it("is fully present when expanded", () => {
    render(<Sidebar data-testid="sb">nav</Sidebar>)
    const el = screen.getByTestId("sb")
    expect(el).not.toHaveAttribute("data-collapsed")
    expect(el).not.toHaveAttribute("aria-hidden")
  })

  it("switches to the floating island style on demand", () => {
    const { rerender } = render(<Sidebar data-testid="sb">nav</Sidebar>)
    const el = screen.getByTestId("sb")
    expect(el).not.toHaveAttribute("data-floating")
    expect(el).toHaveClass("border-r")
    rerender(
      <Sidebar data-testid="sb" floating>
        nav
      </Sidebar>
    )
    expect(el).toHaveAttribute("data-floating")
    expect(el).toHaveClass("rounded-card")
    expect(el).not.toHaveClass("border-r")
  })

  it("keeps the collapse contract even if a consumer passes conflicting props", () => {
    render(
      <Sidebar data-testid="sb" collapsed aria-hidden={false} inert={undefined}>
        nav
      </Sidebar>
    )
    const el = screen.getByTestId("sb")
    expect(el).toHaveAttribute("aria-hidden", "true")
    expect(el).toHaveAttribute("inert")
  })
})
