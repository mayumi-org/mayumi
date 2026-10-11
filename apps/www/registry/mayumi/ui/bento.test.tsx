import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Bento, BentoCell } from "./bento"

describe("Bento", () => {
  it("renders every slot", () => {
    render(
      <Bento data-testid="b">
        <BentoCell>特性一</BentoCell>
        <BentoCell>特性二</BentoCell>
      </Bento>
    )
    expect(screen.getByTestId("b")).toHaveAttribute("data-slot", "bento")
    expect(screen.getByText("特性一")).toHaveAttribute("data-slot", "bento-cell")
    expect(screen.getByText("特性二")).toBeInTheDocument()
  })

  it("defaults to transparent gaps between tiles", () => {
    render(<Bento data-testid="b" />)
    const el = screen.getByTestId("b")
    expect(el).toHaveClass("gap-3")
    expect(el).not.toHaveAttribute("data-divided")
  })

  it("divided paints hairlines by letting the border color show through 1px gaps", () => {
    render(
      <Bento data-testid="b" divided>
        <BentoCell />
      </Bento>
    )
    const el = screen.getByTestId("b")
    expect(el).toHaveAttribute("data-divided", "true")
    expect(el).toHaveClass("gap-px")
    expect(el).toHaveClass("bg-border")
    expect(el).toHaveClass("rounded-card")
  })
})
