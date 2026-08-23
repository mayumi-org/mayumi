import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

function Demo() {
  return (
    <Dialog>
      <DialogTrigger>删除项目</DialogTrigger>
      <DialogContent>
        <DialogTitle>确认删除？</DialogTitle>
        <DialogDescription>此操作不可撤销。</DialogDescription>
        <DialogClose>取消</DialogClose>
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  it("opens on trigger and exposes dialog semantics", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "删除项目" }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("确认删除？")).toBeInTheDocument()
    expect(screen.getByText("此操作不可撤销。")).toBeInTheDocument()
  })

  it("closes via DialogClose", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "删除项目" }))
    await userEvent.click(await screen.findByRole("button", { name: "取消" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("renders the scrim backdrop while open", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "删除项目" }))
    expect(document.querySelector('[data-slot="dialog-backdrop"]')).not.toBeNull()
  })
})
