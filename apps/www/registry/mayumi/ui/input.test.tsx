import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Input } from "./input"

describe("Input", () => {
  it("accepts typing", async () => {
    render(<Input placeholder="名称" />)
    const input = screen.getByPlaceholderText("名称")
    await userEvent.type(input, "mayumi")
    expect(input).toHaveValue("mayumi")
  })

  it("respects disabled", async () => {
    render(<Input placeholder="名称" disabled />)
    expect(screen.getByPlaceholderText("名称")).toBeDisabled()
  })

  it("exposes data-slot and merges className", () => {
    render(<Input placeholder="名称" className="w-40" />)
    const input = screen.getByPlaceholderText("名称")
    expect(input).toHaveAttribute("data-slot", "input")
    expect(input).toHaveClass("w-40")
  })
})
