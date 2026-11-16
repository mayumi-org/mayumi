import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  Island,
  IslandContent,
  IslandFooter,
  IslandHeader,
  IslandTitle,
} from "./island"

describe("Island", () => {
  it("renders slots with 12px island radius and header height", () => {
    render(
      <Island data-testid="isl">
        <IslandHeader data-testid="hdr">
          <IslandTitle>Main Chat</IslandTitle>
        </IslandHeader>
        <IslandContent data-testid="cnt">Body</IslandContent>
        <IslandFooter data-testid="ftr">Footer</IslandFooter>
      </Island>
    )

    const root = screen.getByTestId("isl")
    expect(root).toHaveAttribute("data-slot", "island")
    expect(root).toHaveAttribute("data-variant", "default")
    expect(root).toHaveClass("rounded-island", "border", "border-border")
    expect(screen.getByTestId("hdr")).toHaveClass("h-11", "border-b")
    expect(screen.getByRole("heading", { name: "Main Chat" })).toHaveAttribute(
      "data-slot",
      "island-title"
    )
    expect(screen.getByTestId("cnt")).toHaveAttribute("data-slot", "island-content")
    expect(screen.getByTestId("ftr")).toHaveAttribute("data-slot", "island-footer")
  })

  it("supports sub surface variant", () => {
    render(<Island data-testid="isl" variant="sub" />)
    expect(screen.getByTestId("isl")).toHaveAttribute("data-variant", "sub")
  })
})
