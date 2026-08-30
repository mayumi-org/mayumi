import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "./empty-state"

describe("EmptyState", () => {
  it("renders every slot", () => {
    render(
      <EmptyState data-testid="es">
        <EmptyStateIcon data-testid="icon">
          <svg />
        </EmptyStateIcon>
        <EmptyStateTitle>无项目</EmptyStateTitle>
        <EmptyStateDescription>
          还没有 App 请求过屏幕录制权限。
        </EmptyStateDescription>
        <EmptyStateActions>
          <button type="button">添加</button>
        </EmptyStateActions>
      </EmptyState>
    )
    expect(screen.getByTestId("es")).toHaveAttribute("data-slot", "empty-state")
    expect(screen.getByText("无项目")).toBeInTheDocument()
    expect(
      screen.getByText("还没有 App 请求过屏幕录制权限。")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "添加" })).toBeInTheDocument()
  })

  it("keeps the icon out of the a11y tree", () => {
    render(
      <EmptyState>
        <EmptyStateIcon data-testid="icon">
          <svg />
        </EmptyStateIcon>
      </EmptyState>
    )
    expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true")
  })
})
