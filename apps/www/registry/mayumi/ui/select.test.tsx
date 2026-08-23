import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

function Demo({
  onValueChange,
  side,
}: {
  onValueChange?: (v: unknown) => void
  side?: "top" | "bottom" | "left" | "right"
}) {
  return (
    <Select defaultValue="auto" onValueChange={onValueChange}>
      <SelectTrigger aria-label="外观">
        <SelectValue />
      </SelectTrigger>
      <SelectContent side={side}>
        <SelectItem value="auto">自动</SelectItem>
        <SelectItem value="light">浅色</SelectItem>
        <SelectItem value="dark">深色</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe("Select", () => {
  it("opens the popup on trigger click and lists options", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    expect(await screen.findAllByRole("option")).toHaveLength(3)
  })

  it("selects an option and fires onValueChange", async () => {
    const onValueChange = vi.fn()
    render(<Demo onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    await userEvent.click(await screen.findByRole("option", { name: "深色" }))
    expect(onValueChange).toHaveBeenCalledWith("dark", expect.anything())
  })

  it("forwards side to the positioner", async () => {
    render(<Demo side="bottom" />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    const option = await screen.findByRole("option", { name: "自动" })
    expect(option.closest("[data-side]")).toHaveAttribute("data-side", "bottom")
  })
})
