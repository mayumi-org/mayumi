import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Toolbar, ToolbarTitle } from "./toolbar"

describe("Toolbar", () => {
  it("renders the title as a heading", () => {
    render(
      <Toolbar>
        <ToolbarTitle>隐私与安全性</ToolbarTitle>
      </Toolbar>
    )
    expect(
      screen.getByRole("heading", { name: "隐私与安全性" })
    ).toBeInTheDocument()
  })

  it("merges custom className", () => {
    render(<Toolbar data-testid="t" className="justify-end" />)
    expect(screen.getByTestId("t")).toHaveClass("justify-end")
  })
})
