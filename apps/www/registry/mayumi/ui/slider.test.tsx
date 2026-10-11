import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Slider } from "./slider"

describe("Slider", () => {
  it("exposes the value via the slider role", () => {
    render(<Slider aria-label="音量" defaultValue={30} />)
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "30")
  })

  it("moves with keyboard arrows", async () => {
    const onValueChange = vi.fn()
    render(<Slider aria-label="音量" defaultValue={30} onValueChange={onValueChange} />)
    const thumb = screen.getByRole("slider")
    thumb.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onValueChange).toHaveBeenCalled()
  })
})
