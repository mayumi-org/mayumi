import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TitleBar } from "./titlebar"

describe("TitleBar", () => {
  it("is a drag region for both tauri and electron", () => {
    render(<TitleBar data-testid="tb" />)
    const el = screen.getByTestId("tb")
    expect(el).toHaveAttribute("data-tauri-drag-region")
    expect(el).toHaveClass("app-region-drag")
  })

  it("renders children", () => {
    render(<TitleBar>chrome</TitleBar>)
    expect(screen.getByText("chrome")).toBeInTheDocument()
  })
})
