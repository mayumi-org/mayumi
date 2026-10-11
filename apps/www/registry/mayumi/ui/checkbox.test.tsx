import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Checkbox } from "./checkbox"

describe("Checkbox", () => {
  it("toggles on click", async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="同意" onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole("checkbox", { name: "同意" }))
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("shows the indicator only when checked", async () => {
    const onCheckedChange = vi.fn()
    const { rerender } = render(
      <Checkbox aria-label="同意" checked={false} onCheckedChange={onCheckedChange} />
    )
    expect(document.querySelector('[data-slot="checkbox-indicator"] svg')).toBeNull()
    rerender(
      <Checkbox aria-label="同意" checked={true} onCheckedChange={onCheckedChange} />
    )
    expect(
      document.querySelector('[data-slot="checkbox-indicator"] svg')
    ).not.toBeNull()
  })

  it("respects disabled", async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="同意" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
