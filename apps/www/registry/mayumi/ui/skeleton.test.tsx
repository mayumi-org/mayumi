import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Skeleton } from "./skeleton"

describe("Skeleton", () => {
  it("renders with pulse fill and hides from screen readers", () => {
    render(<Skeleton data-testid="sk" className="h-4 w-32" />)
    const el = screen.getByTestId("sk")
    expect(el).toHaveAttribute("data-slot", "skeleton")
    expect(el).toHaveAttribute("aria-hidden", "true")
    expect(el).toHaveClass("animate-pulse", "bg-fill", "h-4", "w-32")
  })
})
