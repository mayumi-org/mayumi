import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("renders children and fires onClick", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies the primary variant class", () => {
    render(<Button variant="primary">Go</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-accent")
  })

  it("exposes data-slot and merges custom className", () => {
    render(<Button className="w-full">Go</Button>)
    const el = screen.getByRole("button")
    expect(el).toHaveAttribute("data-slot", "button")
    expect(el).toHaveClass("w-full")
  })
})
