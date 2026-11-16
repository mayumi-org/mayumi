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

  it("supports the three layout variants", () => {
    const { rerender } = render(<Sidebar data-testid="sb">nav</Sidebar>)
    const el = screen.getByTestId("sb")
    expect(el).toHaveAttribute("data-variant", "default")
    expect(el).toHaveClass("border-r")
    rerender(
      <Sidebar data-testid="sb" variant="floating">
        nav
      </Sidebar>
    )
    expect(el).toHaveAttribute("data-variant", "floating")
    expect(el).toHaveClass("rounded-card")
    expect(el).not.toHaveClass("border-r")
    // 悬浮岛必须有投影才读得出「抬离窗口一层」
    expect(el).toHaveClass("shadow-[var(--shadow-raised)]")
    rerender(
      <Sidebar data-testid="sb" variant="plain">
        nav
      </Sidebar>
    )
    expect(el).toHaveAttribute("data-variant", "plain")
    expect(el).toHaveClass("bg-transparent")
    expect(el).not.toHaveClass("mayumi-vibrancy")
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
