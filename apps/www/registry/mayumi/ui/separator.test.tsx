import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Separator } from "./separator"

describe("Separator", () => {
  it("renders a horizontal hairline with separator role", () => {
    render(<Separator />)
    const el = screen.getByRole("separator")
    expect(el).toHaveAttribute("data-slot", "separator")
    expect(el).toHaveAttribute("aria-orientation", "horizontal")
    expect(el).toHaveClass("h-px")
  })

  it("supports vertical orientation", () => {
    render(<Separator orientation="vertical" />)
    const el = screen.getByRole("separator")
    expect(el).toHaveAttribute("aria-orientation", "vertical")
    expect(el).toHaveClass("w-px")
  })

  it("keeps a label readable instead of hiding it inside the separator role", () => {
    render(<Separator>10月10日 15:38</Separator>)
    expect(screen.getByText("10月10日 15:38")).toBeVisible()
    expect(screen.queryByRole("separator")).toBeNull()
    expect(screen.getByText("10月10日 15:38")).toHaveClass("tabular-nums")
  })
})
