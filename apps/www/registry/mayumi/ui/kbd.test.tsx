import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Kbd } from "./kbd"

describe("Kbd", () => {
  it("renders the key label", () => {
    render(<Kbd>⌘K</Kbd>)
    const el = screen.getByText("⌘K")
    expect(el.tagName).toBe("KBD")
    expect(el).toHaveAttribute("data-slot", "kbd")
  })

  it("uses tabular digits so ⌘1…⌘9 line up", () => {
    render(<Kbd>⌘1</Kbd>)
    expect(screen.getByText("⌘1")).toHaveClass("tabular-nums")
  })
})
