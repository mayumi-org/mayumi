import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ScrollArea } from "./scroll-area"

describe("ScrollArea", () => {
  it("renders children inside the viewport", () => {
    render(
      <ScrollArea className="h-24" data-testid="sa">
        <p>行内容</p>
      </ScrollArea>
    )
    expect(screen.getByText("行内容")).toBeInTheDocument()
    expect(screen.getByTestId("sa")).toHaveAttribute("data-slot", "scroll-area")
  })

  it("merges custom className on the root", () => {
    render(<ScrollArea className="h-24" data-testid="sa" />)
    expect(screen.getByTestId("sa")).toHaveClass("h-24")
  })
})
