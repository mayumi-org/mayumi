import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog"

import { cn } from "@/registry/mayumi/lib/utils"

const AlertDialog = BaseAlertDialog.Root
const AlertDialogTrigger = BaseAlertDialog.Trigger
const AlertDialogClose = BaseAlertDialog.Close

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Popup>) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop
        data-slot="alert-dialog-backdrop"
        className="fixed inset-0 bg-scrim transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0"
      />
      <BaseAlertDialog.Popup
        {...props}
        data-slot="alert-dialog-content"
        className={cn(
          "mayumi-vibrancy-thick fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-window border border-border p-5 shadow-[var(--shadow-overlay)] outline-none",
          "transition-[scale,opacity] duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97",
          className
        )}
      >
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Title>) {
  return (
    <BaseAlertDialog.Title
      {...props}
      data-slot="alert-dialog-title"
      className={cn("text-ui leading-tight font-semibold text-fg", className)}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Description>) {
  return (
    <BaseAlertDialog.Description
      {...props}
      data-slot="alert-dialog-description"
      className={cn("mt-1 text-ui leading-tight text-fg-secondary", className)}
    />
  )
}

export {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
}
