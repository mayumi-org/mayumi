import { Dialog as BaseDialog } from "@base-ui-components/react/dialog"

import { cn } from "@/registry/mayumi/lib/utils"

const Dialog = BaseDialog.Root
const DialogTrigger = BaseDialog.Trigger
const DialogClose = BaseDialog.Close

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="dialog-backdrop"
        className="fixed inset-0 bg-scrim transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0"
      />
      <BaseDialog.Popup
        {...props}
        data-slot="dialog-content"
        className={cn(
          "mayumi-vibrancy fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-window border border-border p-5 shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-200 ease-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97",
          className
        )}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      {...props}
      data-slot="dialog-title"
      className={cn("text-ui leading-tight font-semibold text-fg", className)}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      {...props}
      data-slot="dialog-description"
      className={cn("mt-1 text-ui leading-tight text-fg-secondary", className)}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
}
