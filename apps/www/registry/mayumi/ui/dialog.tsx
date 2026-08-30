import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const Dialog = BaseDialog.Root
const DialogTrigger = BaseDialog.Trigger
const DialogClose = BaseDialog.Close

const dialogContentVariants = cva(
  "mayumi-vibrancy-thick fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-window border border-border p-5 shadow-[var(--shadow-overlay)] outline-none",
  {
    variants: {
      /**
       * default：开合做 200ms 缩放+淡入，配合模态语境建立层级
       * instant：立即出现，用于快捷键高频唤起的界面（命令面板），动效只会拖慢肌肉记忆
       */
      transition: {
        default:
          "transition-[scale,opacity] duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97",
        instant: "",
      },
    },
    defaultVariants: { transition: "default" },
  }
)

const dialogBackdropVariants = cva("fixed inset-0 bg-scrim", {
  variants: {
    transition: {
      default:
        "transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0",
      instant: "",
    },
  },
  defaultVariants: { transition: "default" },
})

function DialogContent({
  className,
  children,
  transition,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup> &
  VariantProps<typeof dialogContentVariants>) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="dialog-backdrop"
        className={dialogBackdropVariants({ transition })}
      />
      <BaseDialog.Popup
        {...props}
        data-slot="dialog-content"
        data-transition={transition ?? "default"}
        className={cn(dialogContentVariants({ transition, className }))}
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
  dialogContentVariants,
}
