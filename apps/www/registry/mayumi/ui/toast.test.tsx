import { act, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { toast, Toaster } from "./toast"

describe("Toast", () => {
  it("renders a toast when fired", async () => {
    render(<Toaster />)
    act(() => {
      toast("已保存")
    })
    expect(await screen.findByText("已保存")).toBeInTheDocument()
  })

  it("renders title with description", async () => {
    render(<Toaster />)
    act(() => {
      toast("同步完成", { description: "3 个项目已更新" })
    })
    expect(await screen.findByText("同步完成")).toBeInTheDocument()
    expect(await screen.findByText("3 个项目已更新")).toBeInTheDocument()
  })
})
