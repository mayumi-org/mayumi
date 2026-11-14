import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"

function Demo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete feed</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete feed?</AlertDialogTitle>
        <AlertDialogDescription>This removes the subscription and unread items.</AlertDialogDescription>
        <AlertDialogClose>Cancel</AlertDialogClose>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe("AlertDialog", () => {
  it("opens on trigger with alertdialog role and closes on action", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "Delete feed" }))
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument()
    expect(screen.getByText("Delete feed?")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(screen.queryByRole("alertdialog")).toBeNull()
  })
})
