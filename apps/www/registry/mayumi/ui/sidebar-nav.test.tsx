import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"

describe("SidebarNav", () => {
  it("marks the active item for a11y and styling", () => {
    render(
      <SidebarNav>
        <SidebarNavItem active>Wi-Fi</SidebarNavItem>
        <SidebarNavItem>蓝牙</SidebarNavItem>
      </SidebarNav>
    )
    const active = screen.getByRole("button", { name: "Wi-Fi" })
    expect(active).toHaveAttribute("aria-current", "page")
    expect(active).toHaveClass("bg-accent")
    expect(screen.getByRole("button", { name: "蓝牙" })).not.toHaveAttribute(
      "aria-current"
    )
  })

  it("fires onClick", async () => {
    const onClick = vi.fn()
    render(<SidebarNavItem onClick={onClick}>网络</SidebarNavItem>)
    await userEvent.click(screen.getByRole("button", { name: "网络" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("renders the icon tile with custom color class", () => {
    render(
      <SidebarNavItem>
        <SidebarNavIcon data-testid="icon" className="bg-traffic-zoom" />
        Wi-Fi
      </SidebarNavItem>
    )
    expect(screen.getByTestId("icon")).toHaveClass("bg-traffic-zoom")
  })
})
