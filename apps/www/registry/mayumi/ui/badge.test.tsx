import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Badge } from "./badge"

describe("Badge", () => {
  it("renders a count pill", () => {
    render(<Badge>3</Badge>)
    const el = screen.getByText("3")
    expect(el).toHaveAttribute("data-slot", "badge")
    expect(el).not.toHaveAttribute("data-dot")
  })

  it("caps the count at max", () => {
    render(<Badge count={120} />)
    expect(screen.getByText("99+")).toBeInTheDocument()
  })

  it("renders a dot when it has nothing to show", () => {
    const { container } = render(<Badge />)
    const el = container.querySelector('[data-slot="badge"]')
    expect(el).toHaveAttribute("data-dot")
    expect(el).toBeEmptyDOMElement()
  })

  it("hides a zero count", () => {
    const { container } = render(<Badge count={0} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("defaults to the danger tone and accepts others", () => {
    render(
      <>
        <Badge>1</Badge>
        <Badge tone="accent">2</Badge>
        <Badge tone="neutral">3</Badge>
      </>
    )
    expect(screen.getByText("1")).toHaveClass("bg-danger")
    expect(screen.getByText("2")).toHaveClass("bg-accent")
    expect(screen.getByText("3")).toHaveClass("bg-fill-active")
  })
})
