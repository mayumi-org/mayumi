import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("accepts multiline typing", async () => {
    render(<Textarea placeholder="说点什么" />)
    const el = screen.getByPlaceholderText("说点什么")
    await userEvent.type(el, "第一行{enter}第二行")
    expect(el).toHaveValue("第一行\n第二行")
  })

  it("respects disabled", async () => {
    render(<Textarea placeholder="说点什么" disabled />)
    expect(screen.getByPlaceholderText("说点什么")).toBeDisabled()
  })

  it("exposes data-slot and merges className", () => {
    render(<Textarea placeholder="说点什么" className="h-32" />)
    const el = screen.getByPlaceholderText("说点什么")
    expect(el).toHaveAttribute("data-slot", "textarea")
    expect(el).toHaveClass("h-32")
  })
})
