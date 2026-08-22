import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { SearchField } from "./search-field"

describe("SearchField", () => {
  it("is a searchbox and accepts typing", async () => {
    render(<SearchField placeholder="搜索" />)
    const input = screen.getByRole("searchbox")
    await userEvent.type(input, "wifi")
    expect(input).toHaveValue("wifi")
  })

  it("forwards input props and keeps the icon decorative", () => {
    render(<SearchField placeholder="搜索" data-testid="sf" />)
    expect(screen.getByPlaceholderText("搜索")).toBeInTheDocument()
    const input = screen.getByTestId("sf")
    const wrapper = input.closest('[data-slot="search-field"]')
    expect(wrapper?.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("merges className onto the wrapper", () => {
    render(<SearchField data-testid="sf" className="mx-2" />)
    const input = screen.getByTestId("sf")
    const wrapper = input.closest('[data-slot="search-field"]')
    expect(wrapper).toHaveClass("mx-2")
  })
})
