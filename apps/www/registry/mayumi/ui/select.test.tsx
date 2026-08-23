import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

function Demo({ onValueChange }: { onValueChange?: (v: unknown) => void }) {
  return (
    <Select defaultValue="auto" onValueChange={onValueChange}>
      <SelectTrigger aria-label="外观">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
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
})
